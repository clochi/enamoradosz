<?php 
error_reporting(E_ALL ^ E_NOTICE);
$server = "localhost";
$usuario_db = "root";
$clave_db = "";
$nombre_db = "zeta";

$conexion = new mysqli($server, $usuario_db, $clave_db, $nombre_db);

$usuario = json_decode(file_get_contents("php://input"));

$consulta = "SELECT * FROM enamoradosz WHERE email = '$usuario->email'"; 
$resCon = $conexion->query($consulta);
if ($resCon->num_rows == 0){
	$conexion->query("INSERT INTO enamoradosz (nombre, email, fecha) VALUES ('$usuario->nombre', '$usuario->email', 'usuario->fecha')");
	$json = array();
	$json[] = array('nombre'=>$usuario->nombre, 'email'=>$usuario->email, 'fecha'=>$usuario->fecha);
	$res = json_encode($json);
	echo $res;
}else{
	echo false;
}

/*$json = array();
$json[] = array('nombre'=>$usuario->nombre, 'email'=>$usuario->email, 'fecha'=>$usuario->fecha);
$res = json_encode($json);
echo $res;*/
 ?>