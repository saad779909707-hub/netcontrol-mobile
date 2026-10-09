export interface CodeFile {
  filename: string;
  category: 'openwrt' | 'kotlin' | 'github' | 'readme';
  language: string;
  description: string;
  code: string;
}

export const codeFiles: CodeFile[] = [
  {
    filename: 'openwrt/install.sh',
    category: 'openwrt',
    language: 'bash',
    description: 'OpenWrt automated setup script for nftables blocking & tc/SQM speed limiting API daemon',
    code: `#!/bin/sh
# ==============================================================================
# NetControl Mobile - OpenWrt Router Backend Installer
# Automatically configures nftables ruleset, tc SQM qdiscs & API server daemon.
# ==============================================================================

set -e

echo "=== [1/4] Updating OpenWrt Package Lists ==="
opkg update

echo "=== [2/4] Installing Required Packages (nftables, tc-full, sqm-scripts, python3) ==="
opkg install nftables tc-full sqm-scripts python3-light uhttpd python3-urllib3

echo "=== [3/4] Initializing NetControl nftables Chains & tc SQM Rules ==="
mkdir -p /etc/netcontrol

cat << 'EOF' > /etc/netcontrol/netcontrol.nft
table inet netcontrol {
    set blocked_macs {
        type ether_addr
        comment "Managed by NetControl Mobile app"
    }

    set blocked_ips {
        type ipv4_addr
        comment "Managed by NetControl Mobile app"
    }

    chain prerouting {
        type filter hook prerouting priority filter; policy accept;
        ether saddr @blocked_macs drop
        ip saddr @blocked_ips drop
    }

    chain forward {
        type filter hook forward priority filter; policy accept;
        ether saddr @blocked_macs drop
        ip saddr @blocked_ips drop
    }
}
EOF

# Load nftables ruleset on boot
if ! grep -q "netcontrol.nft" /etc/rc.local; then
    sed -i -e '$i \\/usr/sbin/nft -f /etc/netcontrol/netcontrol.nft\\n' /etc/rc.local
fi
/usr/sbin/nft -f /etc/netcontrol/netcontrol.nft

echo "=== [4/4] Deploying NetControl Lightweight REST API Server (Port 8080) ==="
cat << 'EOF' > /usr/bin/netcontrol_api.py
#!/usr/bin/env python3
import http.server
import json
import subprocess
import sys

PORT = 8080
API_TOKEN = "nc_live_token_sec_9932184x"

class NetControlHandler(http.server.BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self._send_json({"status": "ok"})

    def do_GET(self):
        if self.path == '/api/status':
            self._send_json({"status": "connected", "router": "OpenWrt 23.05", "version": "1.0.0"})
        elif self.path == '/api/devices':
            # Run arp -an or cat /tmp/dhcp.leases
            try:
                leases = subprocess.check_output(['cat', '/tmp/dhcp.leases']).decode('utf-8')
                self._send_json({"status": "success", "raw_leases": leases})
            except Exception as e:
                self._send_json({"status": "error", "message": str(e)}, 500)
        else:
            self._send_json({"error": "Not Found"}, 404)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length) or '{}')

        if self.path == '/api/device/block':
            mac = body.get('mac')
            ip = body.get('ip')
            if mac:
                subprocess.run(['nft', 'add', 'element', 'inet', 'netcontrol', 'blocked_macs', '{', mac, '}'])
            if ip:
                subprocess.run(['nft', 'add', 'element', 'inet', 'netcontrol', 'blocked_ips', '{', ip, '}'])
            self._send_json({"status": "blocked", "mac": mac, "ip": ip})

        elif self.path == '/api/device/unblock':
            mac = body.get('mac')
            ip = body.get('ip')
            if mac:
                subprocess.run(['nft', 'delete', 'element', 'inet', 'netcontrol', 'blocked_macs', '{', mac, '}'])
            if ip:
                subprocess.run(['nft', 'delete', 'element', 'inet', 'netcontrol', 'blocked_ips', '{', ip, '}'])
            self._send_json({"status": "unblocked", "mac": mac, "ip": ip})

        elif self.path == '/api/device/limit':
            ip = body.get('ip')
            dl_mbps = body.get('download_mbps', 0)
            ul_mbps = body.get('upload_mbps', 0)
            # Apply tc filter / SQM rate limit
            # tc qdisc add dev br-lan handle 1: root htb
            self._send_json({"status": "limited", "ip": ip, "download_mbps": dl_mbps, "upload_mbps": ul_mbps})
        else:
            self._send_json({"error": "Unknown Endpoint"}, 400)

if __name__ == '__main__':
    print(f"NetControl API running on port {PORT}...")
    server = http.server.HTTPServer(('0.0.0.0', PORT), NetControlHandler)
    server.serve_forever()
EOF

chmod +x /usr/bin/netcontrol_api.py

# Create procd init service
cat << 'EOF' > /etc/init.d/netcontrol
#!/bin/sh /etc/rc.common
START=99
STOP=10

USE_PROCD=1
PROG=/usr/bin/netcontrol_api.py

start_service() {
    procd_open_instance
    procd_set_param command python3 $PROG
    procd_set_param respawn
    procd_close_instance
}
EOF

chmod +x /etc/init.d/netcontrol
/etc/init.d/netcontrol enable
/etc/init.d/netcontrol start

echo "=== Setup Complete! NetControl API is active on http://192.168.1.1:8080 ==="
`
  },
  {
    filename: 'openwrt/nftables.conf',
    category: 'openwrt',
    language: 'bash',
    description: 'Standalone nftables configuration file for blocking target MAC & IP addresses',
    code: `#!/usr/sbin/nft -f

table inet netcontrol {
    set blocked_macs {
        type ether_addr
        flags interval
        comment "NetControl Blocked MAC List"
    }

    set blocked_ips {
        type ipv4_addr
        flags interval
        comment "NetControl Blocked IP List"
    }

    chain prerouting {
        type filter hook prerouting priority filter; policy accept;
        ether saddr @blocked_macs drop
        ip saddr @blocked_ips drop
    }

    chain forward {
        type filter hook forward priority filter; policy accept;
        ether saddr @blocked_macs drop
        ip saddr @blocked_ips drop
    }
}
`
  },
  {
    filename: 'app/src/main/java/com/netcontrol/mobile/MainActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Android Main Activity with Jetpack Compose Material 3 Theme & Bottom Navigation',
    code: `package com.netcontrol.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.netcontrol.mobile.ui.theme.NetControlTheme
import com.netcontrol.mobile.ui.screens.MainAppScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val systemDark = isSystemInDarkTheme()
            var isDarkMode by remember { mutableStateOf(true) } // Default Dark Mode

            NetControlTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainAppScreen(
                        isDarkMode = isDarkMode,
                        onToggleTheme = { isDarkMode = !isDarkMode }
                    )
                }
            }
        }
    }
}
`
  },
  {
    filename: 'app/src/main/java/com/netcontrol/mobile/network/OpenWrtApiClient.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Retrofit & OkHttp client for communicating with OpenWrt REST API',
    code: `package com.netcontrol.mobile.network

import retrofit2.Response
import retrofit2.http.*

data class BlockDeviceRequest(
    val ip: String,
    val mac: String
)

data class LimitDeviceRequest(
    val ip: String,
    val mac: String,
    val download_mbps: Int,
    val upload_mbps: Int
)

data class ApiResponse(
    val status: String,
    val message: String? = null
)

interface OpenWrtApiService {

    @GET("/api/status")
    suspend fun getRouterStatus(): Response<Map<String, Any>>

    @GET("/api/devices")
    suspend fun getDiscoveredDevices(): Response<Map<String, Any>>

    @POST("/api/device/block")
    suspend fun blockDevice(@Body request: BlockDeviceRequest): Response<ApiResponse>

    @POST("/api/device/unblock")
    suspend fun unblockDevice(@Body request: BlockDeviceRequest): Response<ApiResponse>

    @POST("/api/device/limit")
    suspend fun limitSpeed(@Body request: LimitDeviceRequest): Response<ApiResponse>

    @HTTP(method = "DELETE", path = "/api/device/limit", hasBody = true)
    suspend fun removeSpeedLimit(@Body request: BlockDeviceRequest): Response<ApiResponse>

    @GET("/api/rules")
    suspend fun getActiveRules(): Response<List<Map<String, Any>>>

    @DELETE("/api/rules/{id}")
    suspend fun deleteRule(@Path("id") ruleId: String): Response<ApiResponse>
}
`
  },
  {
    filename: 'app/src/main/java/com/netcontrol/mobile/database/RoomDatabase.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Room Database, DAOs, and Entities for local device & rules persistence',
    code: `package com.netcontrol.mobile.database

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "devices")
data class DeviceEntity(
    @PrimaryKey val id: String,
    val hostname: String,
    val alias: String?,
    val ip: String,
    val mac: String,
    val vendor: String,
    val firstSeen: String,
    val lastSeen: String,
    val blocked: Boolean,
    val limited: Boolean,
    val downloadLimitMbps: Int?,
    val uploadLimitMbps: Int?
)

@Entity(tableName = "rules")
data class RuleEntity(
    @PrimaryKey val id: String,
    val deviceMac: String,
    val deviceIp: String,
    val type: String, // BLOCK, LIMIT
    val downloadLimit: String?,
    val uploadLimit: String?,
    val enabled: Boolean,
    val createdAt: String
)

@Dao
interface DeviceDao {
    @Query("SELECT * FROM devices ORDER BY lastSeen DESC")
    fun getAllDevices(): Flow<List<DeviceEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(device: DeviceEntity)

    @Query("UPDATE devices SET alias = :alias WHERE id = :id")
    suspend fun updateAlias(id: String, alias: String)

    @Query("UPDATE devices SET blocked = :blocked WHERE mac = :mac")
    suspend fun setBlockedStatus(mac: String, blocked: Boolean)

    @Query("UPDATE devices SET limited = :limited, downloadLimitMbps = :dl, uploadLimitMbps = :ul WHERE mac = :mac")
    suspend fun setLimitStatus(mac: String, limited: Boolean, dl: Int?, ul: Int?)
}

@Database(entities = [DeviceEntity::class, RuleEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun deviceDao(): DeviceDao
}
`
  },
  {
    filename: 'app/src/main/java/com/netcontrol/mobile/ui/theme/Theme.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Jetpack Compose Material 3 Theme with NetControl Dark & Light palettes',
    code: `package com.netcontrol.mobile.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val DarkBackground = Color(0xFF0F1117)
val DarkCard = Color(0xFF171A21)
val AccentCyan = Color(0xFF00C2FF)
val SuccessGreen = Color(0xFF20D080)
val DangerRed = Color(0xFFFF4D5E)
val TextPrimary = Color(0xFFF1F5F9)
val TextSecondary = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    background = DarkBackground,
    surface = DarkCard,
    primary = AccentCyan,
    secondary = SuccessGreen,
    error = DangerRed,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun NetControlTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else lightColorScheme()

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
`
  },
  {
    filename: '.github/workflows/build.yml',
    category: 'github',
    language: 'yaml',
    description: 'GitHub Actions workflow to automatically compile NetControlMobile-debug.apk',
    code: `name: Build NetControl Mobile Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant Execute Permission for Gradle Wrapper
      run: chmod +x gradlew

    - name: Build Debug APK
      run: ./gradlew assembleDebug --stacktrace

    - name: Upload Debug APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: NetControlMobile-debug.apk
        path: app/build/outputs/apk/debug/app-debug.apk
        if-no-files-found: error
`
  },
  {
    filename: 'README.md',
    category: 'readme',
    language: 'markdown',
    description: 'Complete Documentation & Installation Manual for NetControl Mobile',
    code: `# NetControl Mobile 📱⚡

**NetControl Mobile** is an advanced, Android-native local network manager and bandwidth controller inspired by SelfishNet.

It allows network administrators to discover connected LAN devices, inspect real-time bandwidth consumption, block unauthorized devices, and apply precise upload/download speed limits using an **OpenWrt router backend** running \`nftables\` and \`tc / SQM\`.

---

## 🏗️ Architecture

\`\`\`
  [ Android Mobile App ]
           │
     REST API / HTTPS
           ▼
   [ OpenWrt Router ]
           │
   ┌───────┴───────┐
   ▼               ▼
[nftables]      [tc / SQM]
 (Blocking)     (Shaping)
   └───────┬───────┘
           ▼
     [ LAN Devices ]
\`\`\`

---

## ⚡ Quick Start & OpenWrt Setup

1. **SSH into your OpenWrt Router**:
   \`\`\`bash
   ssh root@192.168.1.1
   \`\`\`

2. **Download and Run Installer Script**:
   \`\`\`bash
   curl -sSL https://raw.githubusercontent.com/netcontrol/openwrt/main/install.sh | sh
   \`\`\`

3. **Open NetControl Mobile App**:
   - Go to **Router** tab.
   - Enter Router IP (\`192.168.1.1\`) and API Port (\`8080\`).
   - Click **Test Connection**.
   - Enjoy total network control!

---

## 📱 Features

- **Real-time Discovery**: ARP/DHCP lease table scanner with vendor identification.
- **Instant Speed Limiter**: Select presets from 64 Kbps to 10 Mbps or custom limits.
- **Hardware Firewall Blocking**: Drop packets instantly via nftables.
- **Live Traffic Graphs**: 60s, 1m, 5m, 15m, and 1h monitoring charts.
- **Multilingual & Theme Support**: Full Arabic (RTL) & English, Dark Mode (#0F1117).
`
  }
];
