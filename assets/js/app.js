$(document).ready(function() {

	var score, currentIndex;
	var data = (function () {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': "/json/data.json",
	        'dataType': "json",
	        'success': function (data) {
	            json = data[0];
	        }
	    });
	    return json;
	})();

	function init() {
		score = 0;
		currentIndex = -1;

		shuffle(data.questions);

		$(".results").html("");
		$('#question').html("<button id='start'>Start</button>");
		$('#playagain, #answer, #answer0, #answer1, #answer2, #answer3').hide().off('click');

		$('#start').on("click", advance);
	}

	function askQuestions() {
		$('#answer0, #answer1, #answer2, #answer3').removeClass("choice");
		$(".errors").html("");
		$('#answer').show().off('click');

		setTimeout(function() {
			$("#wrong-answer, #correct-answer").fadeOut();
		}, 2000);

		shuffle(data.questions[currentIndex].answers);

		$('#question').html(data.questions[currentIndex].question);
		$('#answer0').show().html(data.questions[currentIndex].answers[0].answer);
		$('#answer1').show().html(data.questions[currentIndex].answers[1].answer);
		$('#answer2').show().html(data.questions[currentIndex].answers[2].answer);
		$('#answer3').show().html(data.questions[currentIndex].answers[3].answer);

		$('#answer0, #answer1, #answer2, #answer3').on("click", onClickSelection);
		$('#answer').on("click", onClickAnswer);
	}

	function onClickSelection() {
		$('#answer0, #answer1, #answer2, #answer3').removeClass("choice");
		$(this).addClass("choice");
		$(".errors").html("");
	}

	function onClickAnswer() {
		var choice = $(".choice").val();

		if(choice) {
			score += data.questions[currentIndex].answers[choice].score;
			if(data.questions[currentIndex].answers[choice].score == 1) {
				$("#correct-answer").fadeIn();
			} else {
				$("#wrong-answer").fadeIn();
			}

			advance();
		} else {
			$(".errors").html("Please select an answer!");
		}
	}

	function endScreen() {
		$('#question').html("Your score: " + score);
		
		if(score < 5) {
			$(".results").html("Do you even game bro?");
		} else if(score < 9) {
			$(".results").html("Hmm... my mom could do better...");
		} else {
			$(".results").html("Not bad!");
		}
		
		$('#answer, #answer0, #answer1, #answer2, #answer3').hide().off('click');
		$('#playagain').show();

		setTimeout(function() {
			$("#wrong-answer, #correct-answer").fadeOut();
		}, 2000);

		$('#playagain').on("click", function() {
			init();
			advance();
		});
	}

	function advance() {
		currentIndex++;

		if(currentIndex < data.questions.length) {
			askQuestions();
		} else {
			endScreen();
		}
	}

	function shuffle(array) {
		var nowIndex = array.length, temporaryValue, randomIndex;

		while (0 !== nowIndex) {
			randomIndex = Math.floor(Math.random() * nowIndex);
			nowIndex -= 1;
			temporaryValue = array[nowIndex];
			array[nowIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	init();

});