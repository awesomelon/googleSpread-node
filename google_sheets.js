const googleSpreadsheet = require('google-spreadsheet');
const creds = require('./skilful-vertex-264400-ae8f10894162.json');
const doc = new googleSpreadsheet('1HDro_qLxVHiO7wOD8m08Js5uxpfEJ0-nn61nnTSjuHU');

// 네이버 검색 API예제는 블로그를 비롯 전문자료까지 호출방법이 동일하므로 blog검색만 대표로 예제를 올렸습니다.
// 네이버 검색 Open API 예제 - 블로그 검색
var express = require('express');
var app = express();
var client_id = 'KfFmE4RhA15qJ43nIUia';
var client_secret = 'aKozUsAf4R';
app.get('/search/blog', (req, res) => {
    var api_url = `https://openapi.naver.com/v1/search/blog?query=${encodeURI(req.query.query)}&start=${1}&display=100`; // json 결과
    //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
    var request = require('request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };
    request.get(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const jsonBody = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            res.end(body);

            doc.useServiceAccountAuth(creds, err => {
                let employeeDatas = jsonBody.items.map(item => {
                    return {
                        맛집이름: item.title,
                        맛집링크: item.link,
                        맛집설명: item.description
                    };
                });
                for (let employeeType of employeeDatas) {
                    doc.addRow(2, employeeType, err => {
                        console.error(err);
                    });
                }
            });
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});
app.listen(3000, function() {
    console.log('app listening on port 3000!');
});
