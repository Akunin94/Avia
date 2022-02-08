<?php

    $phone = $_POST['phone'];
    
    mail('aviastroiteley18@okna.io', 'Заявка с сайта: Тихвинский квартал', "Телефон: {$phone}");

    header("Location: /");
    die();