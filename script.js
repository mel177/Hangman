var Hangman = function(elem)


{

    var alphabet = "abcdefghijklmnopqrstuvwxyz",
        request,
        word = "computers",
        word_list = ["smoothie", "summer", "awkward", "apple", "exception", 
        "beach", "football", "winner", "rockets", "diploma", "galaxy", "tennis", 
        "programming", "bike", "grill", "university",
        "mario", "pokemon", "unicorn", "define", "freezes", "packers"],
        word_length,
        letters_guessed = [],
        
        displayed_word,
        lives_left = 10,
        game_complete = false;
        
    // create DOM elements
    var top_display = quickCreateElement("div", "top-display"),     
        DOM_displayed_word = quickCreateElement("div", "displayed-word"),
        DOM_lives_left = quickCreateElement("div", "lives-left"),
        DOM_game_message = quickCreateElement("div", "message"),
        buttons_section = quickCreateElement("div", "buttons-section"),
        // DOM_letters_guessed,
        letter_buttons = [];    
        
    // create buttons
    for (var i=0; i<26; i++) {
        letter_buttons.push(quickCreateElement("button", "letter-button", alphabet[i]));
    }
    
    // organise DOM elements        
    top_display.appendChild(DOM_displayed_word);
    top_display.appendChild(DOM_lives_left);
    top_display.appendChild(DOM_game_message);
    
    for (var i = 0; i < 26; i++) {
        buttons_section.appendChild(letter_buttons[i]);
    }
    
    
    // HELPER FUNCTIONS
    
    function quickCreateElement(type, cls, id) {
        var ret = document.createElement(type);
        if (cls) { ret.classList.add(cls); }
        if (id) { ret.id = id; }
        return ret
    }
        
    function contains(arr, el) {
    // function to check if arr contains el
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == el) { return true }
        }
        return false
    };


    // PROCESS FUNCTIONS
    
    function reset () {
        while(elem.lastChild) {
            elem.removeChild(elem.firstChild);
        }
    };
    
    function getWord() {
        request = new XMLHttpRequest;
        request.open('GET', 'https://crossorigin.me/http://randomword.setgetgo.com/get.php');
        request.onload = function() {
            if (request.status == 200){     
                word = request.response.toLowerCase();
                loadInitialDOM();
                render();   
            }
            // ...else
        };
        request.onerror = function() {
            console.log('connection error');
        };
        request.send();     
    };
    
    // to use on localhost etc., where API is blocked
    function getWordNoAPI () {
        word = word_list[Math.floor(Math.random() * word_list.length)];
        loadInitialDOM();
        render();   
    };
    
    function loadInitialDOM() {    
        elem.appendChild(top_display);
        elem.appendChild(buttons_section);
    };

    function render() {
        renderDisplayedWord();
        DOM_lives_left.innerHTML = "Lives left: " + lives_left;
        evaluateResult();
stickFigure();
        if (game_complete) {
            DOM_game_message.innerHTML = game_complete;
        }
        renderButtons(game_complete);
    };
    function stickFigure() {
    if(lives_left === 9){
    $("#head").removeClass("hide");
    }else if(lives_left === 8){
    $("#torso").removeClass("hide");
    }else if(lives_left === 7){
    $("#armL").removeClass("hide");
    }else if(lives_left === 6){
    $("#armR").removeClass("hide");
    }else if(lives_left === 5){
    $("#legL").removeClass("hide"); 
    }
};


    function renderDisplayedWord() {
        displayed_word = "";
        for (var i = 0; i < word.length; i++) {
            if (contains(letters_guessed, word[i])) {
                displayed_word += word[i];
            }
            else {
                displayed_word += "_";
            }
            displayed_word += (i == word.length) ? "" : " " ;
        }
        DOM_displayed_word.innerHTML = displayed_word;
    };
    
    function evaluateResult() {
        if (!contains(displayed_word, "_")) {
            game_complete = "Congratulations! You correctly guessed the word " + word + "(<a target='_blank' href='https://www.google.co.uk/search?q=definition+" + word + "'>?</a>)";
        }
        if (lives_left <= 0) {
            game_complete = "Bad luck, you lose! The correct word was " + word + "(<a target='_blank' href='https://www.google.co.uk/search?q=definition+" + word + "'>?</a>)";
        }
    };

    function renderButtons(game_over) {
        for (var i = 0; i < 26; i++) {
            b = letter_buttons[i];
            b.innerHTML = "";
            b.removeEventListener("click", letter_select);
            b.innerHTML = alphabet[i];
            if (!game_over && !contains(letters_guessed, alphabet[i])) {
                b.addEventListener("click", letter_select);
            }
            else {
                b.classList.add("deactivated");
            }
        }
    };
  
    function letter_select() {
        var letter = event.target.id;
        // if not already there..
        letters_guessed.push(letter);
        if (!contains(word, letter)) {
            lives_left -= 1;
        }
        render();
    };

    // START GAME
    // getWord() calls loadInitialDOM() and render() if request is successful, because of
    // asynchronicity. Should maybe be called initiateGame or something similar
    
    reset();
    //getWord();
    getWordNoAPI(); 

};

document.addEventListener('DOMContentLoaded', function() {

    var new_game_button = document.getElementById("new-game-button")
        hangman_div = document.getElementById("hangman");
        
    new_game_button.addEventListener("click", function() {
        new Hangman(hangman_div);
    });
});



$("#animate").click(function(){
    dropBody();
    $("#rEyes").addClass("hide");
    $("#xEyes").removeClass("hide");
});

function dropBody () {
  $("#door1").velocity({rotateZ: 90}, 1000);
  $("#door2").velocity({rotateZ: -90}, 1000);
  fall();  
}