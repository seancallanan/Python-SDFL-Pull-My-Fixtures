"use strict;";

var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

var getFixtures = function() {
  request({
    url: 'http://www.sdfl.ie/upcomingFixtures'
    }, function(err, response, body) {
      var self = this;
      self.items = [];
      if(err && response.statusCode !== 200) {
        console.log('Request error.');
      }

      var $ = cheerio.load(body),
          $body = $('body'),
          $fixtures = $body.find('.competition');
      var terenureFixtures = 0;
      if($fixtures.length <= 0){
        console.log('No fixtures posted');
      }
      else {
        $fixtures.each(function(i, item) {
          var $ageGroup = $(item).children('td');
          var $fixturesAtAge = $(item).nextUntil('.competition');

          printFixtures($, $fixturesAtAge, $ageGroup);
        });
      }
  });
}

var findPrevDate = function ($, $currentNode) {
    // we are finding form the home element which in in a td the date is at the tr level
    var $top = $currentNode.parent();

    // iterate back over the tr in the table until we find one with a date class
    while(!$top.prev().hasClass('date')){
        $top = $top.prev();
    }

    return $top.prev().text();
}

var printFixtures = function($, $fixturesAtAge, $ageGroup) {
  var $homeClub = $('.item  > .homeClub', $fixturesAtAge);
  var $awayClub = $('.item  > .awayClub', $fixturesAtAge);
  if($homeClub.text().indexOf('Terenure Rangers') >= 0 ||
     $awayClub.text().indexOf('Terenure Rangers') >= 0) {
    var $awayClubAr = $awayClub.toArray();
    var $homeClubAr = $homeClub.toArray();
    var $time = $('.item > .time', $fixturesAtAge);
    var $venue = $('td:has(strong)', $fixturesAtAge);
    var $referee = $('.item > .referee', $fixturesAtAge);
    var $comment = $('.item > .comment', $fixturesAtAge);

    for(var ndx = 0; ndx < $homeClub.length; ndx++){
      var away = $($awayClubAr[ndx]).slice(0).eq(0).text();
      var home = $($homeClubAr[ndx]).slice(0).eq(0).text();
      var $homeElement = $homeClubAr[ndx];
      if(home.indexOf('Terenure Rangers') >= 0 ||
         away.indexOf('Terenure Rangers') >= 0){
          var timeAr = $time.toArray();
          var venueAr = $venue.toArray();
          var refereeAr = $referee.toArray();
          var commentAr = $comment.toArray();
          var date = findPrevDate($, $($homeElement));

          // printout each fixture
          console.log($ageGroup.text() + ', \t' +
          home + ' v ' +
          away + ' \t' +
          date + ' at '  +
          $(timeAr[ndx]).slice(0).eq(0).text() + ' \t' +
          $(venueAr[ndx]).slice(0).eq(0).text() + ' \t' +
          '\tRef: ' + $(refereeAr[ndx]).slice(0).eq(0).text() + '\t' +
          $(commentAr[ndx]).slice(0).eq(0).text());
      }
    }
  }
}

getFixtures();
