(function () {
    var selectedSubjects = [];
    var onClickSubjectHandler = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                selectedSubjects.push(data);
                console.log(selectedSubjects);
            }
        };
        var baseUrl = 'db_service.php';
        var url = baseUrl + '?title=' + this.innerHTML;
        xhr.open('GET', encodeURI(url), false);
        xhr.send();
    };

    var input_box = document.getElementById('subject_search');
    input_box.onkeyup = function () {
        var val = document.getElementById('subject_search').value;
        var suggestionBox = document.getElementById('suggestionBox');
        if(val.length >2) {
            xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    //clearing suggestion box so that only one suggestion data is in the box after every request
                    while(suggestionBox.firstChild) {
                        suggestionBox.removeChild(suggestionBox.firstChild);
                    }

                    //parsing json data to insert in the suggestion box
                    var data = JSON.parse(xhr.responseText);
                    for(var key in data) {
                        if (data.hasOwnProperty(key)) {
                            var el = document.createElement('section');
                            //inserting title
                            var titleNode = document.createElement('p');
                            var textNode = document.createTextNode(data[key]['title']);
                            titleNode.className += 'titleInfo';
                            titleNode.appendChild(textNode);
                            el.appendChild(titleNode);

                            //retrieving schedule data
                            var schedule = data[key]['class_schedule'];
                            for(var i = 0; i < schedule.length; i++) {
                                var day = document.createElement('span');
                                var start = document.createElement('span');
                                var end = document.createElement('span');

                                var tnd = document.createTextNode(schedule[i]['day']);
                                var tns = document.createTextNode(schedule[i]['starts_at']);
                                var tne = document.createTextNode(schedule[i]['ends_at']);

                                day.appendChild(tnd);
                                start.appendChild(tns);
                                end.appendChild(tne);

                                day.className += 'dayInfo';
                                start.className += 'startInfo';
                                end.className += 'endInfo';
                                el.appendChild(day);
                                el.appendChild(start);
                                el.appendChild(end);
                                el.appendChild(document.createElement('br'));
                            }
                            el.className += 'card';
                            titleNode.onclick = onClickSubjectHandler;
                            suggestionBox.appendChild(el);
                        }
                    }
                }
            };
            var baseUrl = 'handle_db.php';
            url = baseUrl + '?title=' + val;
            xhr.open('GET', url, true);
            xhr.send();
        }
        else {
            while(suggestionBox.firstChild) {
                suggestionBox.removeChild(suggestionBox.firstChild);
            }
        }
    };
})();
