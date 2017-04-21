/**
 * Created by scallanan on 21/04/2017.
 */

var cheerio = require('cheerio');

var markup = '<tr id="daterow" class="date"><td>26/04/2017</td><tr id="oddrow" class="odd"><td>Prev but not date</td></tr><tr id="homerow" class="item"><td class="homeClub">Terenure Rangers</td></tr>';

//var markup = '<ul id="fruits"> <li class="apple">Apple</li> <li class="orange">Orange</li> <li class="pear">Pear</li> </ul>';

const $ = cheerio.load(markup);

//console.log($('.pear').prevUntil('.apple').text()); // returns Orange

console.log($('.homeClub').parent().prev().hasClass('date'));

var $top = $('.homeClub').parent();
while(!$top.prev().hasClass('date')){
    $top = $top.prev();
}

console.log($top.prev().text());