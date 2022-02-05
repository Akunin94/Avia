<?php

    $phone = $_POST['phone'];
    
    mail('tihvinskiy-kvartal@okna.io', 'Заявка с сайта: Тихвинский квартал', "Телефон: {$phone}");

    header("Location: /");
    die();