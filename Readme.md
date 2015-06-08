Created by Brandon Swanson During the Week of June 1st - June 7th as a culmination of 10 weeks of rapid learning on broad topics including.

-Git and Github
-HTML
-CSS
-JavaScript
-PHP
-Mysqli
-Bootstrap Java and CSS library
-Security and Scalability

Live-URL: http://web.engr.oregonstate.edu/~swansonb/SurfSpots/main.php

Summary:
    My Surf Spots polls weather and surf data for popular surfing locations in the Bay Area California and presents you with key info for knowing if its time to hit the waves and where will be the best spot right now.  The user is able to save ther perfered factors and the page highlights the surfing locations that meet their desires right now.

This project wildly surpassed my expectations but yet still left me wanting to do more with it. Hence this Alpha release branch, as features were pruned, and hard decisions made I have a pointer back to where I still thought every feature would be included.

User Database interactions:
    The user interacts with the database by maintaining a prefrences profile, prefered Weather, Water Temperature, Wave Height, and Surf Rating as well as perfered temp units F/C  (cecilus is in high demand in the bay area that this app targets).  Their prefrences are retrieved and displayed for them on login or on session resume, in the highlighting of surf locations that meet their criteria and in the settings dialog having their prefrences filled in.


Possible error to note:
    the Open Weather Map server occasionally returns a CORS violation code, but it occurs about 1 in 80 requests.  I would have like to have made the call with PHP/cURL but this behaviour manifested too late for me to implement a different method of making the calls.  However you will notice that I endevored to handle possible failures gracefully,  the progress bar still completes but any not sucessful fiels have a 'currently unavailable' icon and they are not tallied in the user prefrences comparisons.
    

Wow Factor Features:
    -Celcius/Farenheight conversion happens instantly accross page, including in settings dialog
    -There are no page breaks during other than a log out, no break in content for a new page to load
    -animated progress bar and fading 'blockers', avoid 'pop-in' effect, each panel of information is displayed when all of its information is ready
    -google map generated backgrounds, fiting perfectly with the theme and content
    -Looks best on Desktop but has been tested on laptop and cell phone and it is very 'Responsive'!
    
 Acknowledgments:
    external resources used in this project were: 
    -Bootstrap CSS/JS and few JQuery calls for modal show and hide triggers and callbacks (Bootsrap doesnt provide info on how to get these callbacks with Javascript).
    
    -A replacement btn-inverse css style sheet for the missing class in Bootstrap 3. Provided by: untuk halaman
    at:  http://www.kelasabil.com/en/library/bootstrap/reviving-inverse-button-bootstrap-3
    
    -And most importantly these wonderful public API's:
    
        -Spitcast Surf Forecast
         at:http://www.spitcast.com
         
        - Open Weather Map
          at:http://openweathermap.org
        
        -Twitter Bootstrap
         at:http://getbootstrap.com/
         
        -Google Maps
         at:https://developers.google.com/maps/


