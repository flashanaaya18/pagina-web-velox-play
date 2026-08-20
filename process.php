<?php
/**
 * Cinemax Plus (Velox Play) v7.3.2 - VIP Support & Request Handler
 * Language: PHP 8.2+ Backend Processing Script
 */

header('Content-Type: application/json; charset=utf-8');

define('WHATSAPP_NUMBER', '525616840524');
define('APP_NAME', 'Cinemax Plus (Velox Play) v7.3.2');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método de solicitud no permitido.'
    ]);
    exit;
}

$action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_SPECIAL_CHARS) ?? 'vip_request';
$name   = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$plan   = trim(filter_input(INPUT_POST, 'plan', FILTER_SANITIZE_SPECIAL_CHARS) ?? '1 Mes');
$device = trim(filter_input(INPUT_POST, 'device', FILTER_SANITIZE_SPECIAL_CHARS) ?? 'Android / Smart TV');
$note   = trim(filter_input(INPUT_POST, 'note', FILTER_SANITIZE_SPECIAL_CHARS) ?? '');

if (empty($name)) {
    $name = 'Usuario VIP';
}

$cleanPlan = preg_replace('/[^a-zA-Z0-9\s]/', '', $plan);
$cleanDevice = preg_replace('/[^a-zA-Z0-9\s\/]/', '', $device);

switch ($action) {
    case 'vip_request':
        $message = "🍿 *SOLICITUD DE MEMBRESÍA VIP GOLD — CINEMAX PLUS (VELOX PLAY)* 🍿\n\n"
                 . "👤 *Cliente:* {$name}\n"
                 . "💎 *Plan Elegido:* {$cleanPlan}\n"
                 . "📱 *Dispositivo:* {$cleanDevice}\n"
                 . "📝 *Nota / Solicitud:* " . ($note ? $note : 'Deseo activar mi suscripción VIP inmediatamente.') . "\n\n"
                 . "🚀 *Enviado desde el Sitio Oficial v7.3.2*";
        break;

    case 'support_ticket':
        $message = "🆘 *SOPORTE TÉCNICO VIP — VELOX PLAY v7.3.2* 🆘\n\n"
                 . "👤 *Usuario:* {$name}\n"
                 . "📱 *Dispositivo:* {$cleanDevice}\n"
                 . "❓ *Consulta / Problema:* {$note}\n";
        break;

    default:
        $message = "Hola! Deseo más información sobre el Pase VIP Gold de Cinemax Plus (Velox Play) v7.3.2.";
        break;
}

$encodedMessage = rawurlencode($message);
$whatsappUrl = "https://api.whatsapp.com/send?phone=" . WHATSAPP_NUMBER . "&text=" . $encodedMessage;

echo json_encode([
    'status' => 'success',
    'message' => 'Solicitud procesada correctamente. Redirigiendo a WhatsApp VIP...',
    'redirect_url' => $whatsappUrl,
    'data' => [
        'name' => $name,
        'plan' => $cleanPlan,
        'device' => $cleanDevice,
        'app' => APP_NAME
    ]
]);
exit;
