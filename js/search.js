(function () {
    var input_box = document.getElementById('subject_search');
    input_box.onkeyup = function () {
        xhr = new XMLHttpRequest();
        var val = document.getElementById('subject_search').value;
        console.log(val);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var data = xhr.responseText;
                var el = document.createElement('div');
                var textNode = document.createTextNode(data);
                el.appendChild(textNode);
                document.getElementsByTagName('body')[0].appendChild(el);
            }
        };
        xhr.open('GET', 'handle_db.php', true);
        xhr.send();
    };
})();
