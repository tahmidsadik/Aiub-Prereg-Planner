var selectedSubjects = [];
(function () {
    var onClickSubjectHandler = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                selectedSubjects.push(data);
            }
        };
        var baseUrl = 'db_service.php';
        var url = baseUrl + '?title=' + this.innerHTML;
        xhr.open('GET', encodeURI(url), false);
        xhr.send();
        if(selectedSubjects.length > 0) {
            renderGraph(sanitizeData(selectedSubjects));
        }
    };

    var getDayEquivalentNumber = function (day) {
        var daysoftheweek = {'Saturday' : 1, 'Sunday' : 2, 'Monday' : 3, 'Tuesday' : 4, 'Wednesday': 5,
            'Thursday': 6, 'Friday': 7};
        return daysoftheweek[day];
    };


    //change this part to map and filter
    var sanitizeData = function(data) {
        var sanitized_data = [];
        for(var i = 0; i < data.length; i++) {
            for(key in data[i]) {
                if(data[i].hasOwnProperty(key)) {
                    var schedule = data[i][key]['class_schedule'];
                    for(var j = 0; j < schedule.length; j++) {
                        var day = getDayEquivalentNumber(schedule[j]['day'].trim());

                        var start = schedule[j]['starts_at'];
                        var shour = start.split(' ')[0].split(':')[0];
                        var smin = start.split(' ')[0].split(':')[1];
                        var stype = start.split(' ')[1].trim();

                        if(stype === 'PM') {
                            shour = parseInt(shour);
                            if(shour < 9) {
                                shour += 12;
                            }
                        }

                        var start_at = parseInt(shour + smin);


                        var end = schedule[j]['ends_at'];
                        var ehour = end.split(' ')[0].split(':')[0];
                        var emin = end.split(' ')[0].split(':')[1];
                        var etype = end.split(' ')[1].trim();

                        if(etype === 'PM') {
                            ehour = parseInt(ehour);
                            if(ehour < 9) {
                                ehour += 12;
                            }
                        }

                        var ends_at = parseInt(ehour + emin);
                        var duration = ends_at - start_at;
                        sanitized_data.push({'day': day, 'starts_at': start_at, 'duration': duration});
                    }
                }
            }
        }
        return sanitized_data;
    };


    var renderGraph = function (classes) {
        console.log(d3.select('#graph'));
        console.log(classes[0]['starts_at']);
        console.log(classes[0]['day']);
        console.log(classes[0]['duration']);
        var graph = d3.select('#graph').selectAll('rect').data(classes)
            .enter()
            .append('rect')
            .attr('width', function (d) { return d['duration'] / 3; })
            .attr('height', '30')
            .attr('x', function(d) { return d['starts_at'] / 2.5})
            .attr('y', function(d) {return d['day'] * 40})
            .style('fill', '#FF2637');
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
                    //use map and filter here
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