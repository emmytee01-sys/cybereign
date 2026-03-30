<?php
/**
 * CYBEREIGN CMS API (PHP Backend)
 * Handles authentication and content management via JSON/REST.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database Connection Settings (Update for Production)
$db_host = 'localhost';
$db_name = 'cybereign_cms';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

switch ($action) {
    case 'login':
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Simple session/key for demo, in production use JWT
            $token = bin2hex(random_bytes(32));
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful", 
                "token" => $token,
                "user" => ["username" => $user['username']]
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid credentials or user not found"]);
        }
        break;

    case 'get_content':
        $stmt = $pdo->prepare("SELECT content_value FROM site_content WHERE content_key = 'main_config'");
        $stmt->execute();
        $config = $stmt->fetch();
        
        if ($config) {
            echo $config['content_value'];
        } else {
            // Fallback if no config in DB
            echo json_encode(["status" => "error", "message" => "Configuration not found in database"]);
        }
        break;

    case 'update_content':
        // In production, verify the token before updating
        $content = $data['content'] ?? null;
        if (!$content) {
            echo json_encode(["status" => "error", "message" => "No content provided"]);
            break;
        }

        $stmt = $pdo->prepare("INSERT INTO site_content (content_key, content_value) VALUES ('main_config', ?) ON DUPLICATE KEY UPDATE content_value = ?");
        $stmt->execute([json_encode($content), json_encode($content)]);

        echo json_encode(["status" => "success", "message" => "Content updated successfully"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid action specified: $action"]);
        break;
}
?>
