<?php
// Archivo de prueba para verificar que PHP funciona en el servidor
echo "PHP está funcionando correctamente\n";
echo "Versión de PHP: " . phpversion() . "\n";
echo "Función mail() disponible: " . (function_exists('mail') ? 'Sí' : 'No') . "\n";

// Verificar configuración de mail
if (function_exists('ini_get')) {
    echo "sendmail_path: " . ini_get('sendmail_path') . "\n";
    echo "SMTP: " . ini_get('SMTP') . "\n";
    echo "smtp_port: " . ini_get('smtp_port') . "\n";
}

// Intentar enviar un email de prueba
if (function_exists('mail')) {
    $to = 'iagosantospardo@gmail.com';
    $subject = 'Test PHP desde guestentry.es';
    $message = 'Este es un email de prueba desde el servidor.';
    $headers = "From: noreply@guestentry.es\r\n";
    
    if (@mail($to, $subject, $message, $headers)) {
        echo "Email de prueba enviado correctamente\n";
    } else {
        echo "Error al enviar email de prueba\n";
        echo "Último error: " . error_get_last()['message'] . "\n";
    }
} else {
    echo "La función mail() no está disponible\n";
}
?>

