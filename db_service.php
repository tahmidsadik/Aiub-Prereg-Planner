<?php

$search_title = (isset($_GET['title']) ? $_GET['title'] : null);

if($search_title !== null) {
    $search_title =  urldecode($search_title);
    header('Content-type: application/json');
    $m = new MongoClient();
    $db = $m->selectDB("prereg");
    $collection = $db->selectCollection("subjects");

    $where = array('title' => $search_title);
    $cursor = $collection->find($where);
    $data = iterator_to_array($cursor);

//creating the response

    echo json_encode($data);
}