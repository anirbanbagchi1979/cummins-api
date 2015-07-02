/*========================================================================================================+
 | Copyright (c) 2008, 2015, Oracle and/or its affiliates. All rights reserved.                           |
 +========================================================================================================+
 |                                                                                                        |
 |                                                                                                        |
 | Provided on an 'as is' basis, without warranties or conditions of any kind, either express or implied, |
 | including, without limitation, any warranties or conditions of title, non-infringement,                |
 | merchantability, or fitness for a particular purpose. You are solely responsible for determining the   |
 | appropriateness of using and assume any risks. You may not redistribute.                               |
 |                                                                                                        |
 | Please refer to http://www.ateam-oracle.com/a-team-chronicles for details                              |
 |                                                                                                        |
 | HISTORY                                                                                                |
 | 1.0 01-07-2015 Christopher Karl Chan (A-Team Cloud Solution Architects) CREATED                        |
 |                                                                                                        |
 +=======================================================================================================*/


var newOrderNums = ["WO9887872",
    "WO7363638",
    "WO8744744",
    "WO9874745",
    "WO9484742",
    "WO9887872",
    "WO7363638",
    "WO8744744",
    "WO9874745",
    "WO9484742"
];


//Choose a random wo
var orderNum = newOrderNums[Math.floor(Math.random() * newOrderNums.length)];
console.log(orderNum);

var idx = newOrderNums.indexOf(orderNum);

var updatedCache = {};
console.log(newOrderNums);

newOrderNums.splice(idx, 1);

console.log(newOrderNums);



var path = "chris".substring(1);

var chris = {};
chris.chris2 = "chris2"
chris.chris2.chris3 = "chris3";

console.log(chris['chris2']['chris3']);

console.log(chris.chris2.chris3)


var transform = require('jsonpath-object-transform');

var template = {
    foo: ['$.some.crazy', {
        bar: '$.example'
    }]
};

var data = {
    some: {
        crazy: [
            {
                example: 'A'
            },
            {
                example: 'B'
            }
        ]
    }
};

var result = transform(data, template);



var cf = require('./mock.json');


var template1 = {
    faultCodes: '$..*'
};
console.log(transform(cf, template1));

