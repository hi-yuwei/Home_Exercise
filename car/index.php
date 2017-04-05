<?php
include '../../public/counter.php';
include '../../public/fun.php';

if(isMobile()){
	require_once('index_mobile.html');
}else{
	require_once('index_pc.html');
}
?>