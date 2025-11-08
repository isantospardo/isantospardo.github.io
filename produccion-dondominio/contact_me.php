<?php
// Habilitar reporte de errores para debugging (desactivar en producción si es necesario)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Headers
header('Content-Type: text/plain; charset=UTF-8');

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "error";
    exit;
}

// Check for empty fields
if(empty($_POST['name'])      ||
   empty($_POST['email'])     ||
   empty($_POST['phone'])     ||
   empty($_POST['message'])   ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
   echo "error";
   exit;
   }
   
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$message = strip_tags(htmlspecialchars($_POST['message']));

// Cargar PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Crear instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración del servidor SMTP de DonDominio
    $mail->isSMTP();
    $mail->Host = 'smtp.dondominio.com'; // O smtp.guestentry.es - Verifica con DonDominio
    $mail->SMTPAuth = true;
    $mail->Username = 'contacto@guestentry.es'; // REEMPLAZA con tu cuenta de correo de DonDominio
    $mail->Password = 'TU_CONTRASEÑA'; // REEMPLAZA con la contraseña de tu cuenta de correo
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // O PHPMailer::ENCRYPTION_SMTPS para SSL
    $mail->Port = 587; // O 465 para SSL
    
    // Configuración de caracteres
    $mail->CharSet = 'UTF-8';
    
    // Remitente
    $mail->setFrom('contacto@guestentry.es', 'Sercon Gestoría'); // REEMPLAZA con tu cuenta de correo
    
    // Destinatario
    $mail->addAddress('iagosantospardo@gmail.com', 'Iago Santos Pardo');
    
    // Reply-To
    $mail->addReplyTo($email_address, $name);
    
    // Contenido del email
    $mail->isHTML(false); // Email en texto plano
    $mail->Subject = "Sercon Gestoría - Formulario de Contacto: $name";
    $mail->Body = "Has recibido un nuevo mensaje desde el formulario de contacto de tu sitio web.\n\n";
    $mail->Body .= "Detalles del contacto:\n\n";
    $mail->Body .= "Nombre: $name\n";
    $mail->Body .= "Email: $email_address\n";
    $mail->Body .= "Teléfono: $phone\n\n";
    $mail->Body .= "Mensaje:\n$message\n";
    
    // Enviar email
    $mail->send();
    echo "success";
    
} catch (Exception $e) {
    // Error al enviar
    echo "error";
    // Para debugging, puedes descomentar la siguiente línea:
    // error_log("Error PHPMailer: " . $mail->ErrorInfo);
}
?>
