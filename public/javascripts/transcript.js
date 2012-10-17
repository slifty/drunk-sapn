// Object
var Transcript = Class.extend({
	
	init: function() {
		this.drinkWords = ["Murderball", "Affordable", "Abortion", "Opponent", "Economy", "Wall Street","Iran","Iraq","Nuclear","Social Security","Ronald Reagan","Bin Laden","Al Queda","Health Care","Massachusetts","Main Street","Katrina","Gasoline","Community Organizer","SuperPAC","Afghanistan","Debt","Deficit","Values","Government","Taxes","Future","Bipartisan","Budget","Immigration","Energy","Dream Act","Outsource","Spending","States","Caymans","Allies","Natural","Clean","Governor","Insurance","Medicare","Florida","Texas","Ohio","Pennsylvania","Middle","Loophole","Seniors","Trillion","ObamaCare","RomneyCare","Promise","Military","Aid","Jobs","Big Bird","PBS","Biden","Ryan"];
		this.tweakedWords = [];
		this.drinkCounts = [];
		this.drinkTotal = 0;
		this.previousWord = "";

		$("#drink_words").append("<strong>Drink Words:</strong>");		
		
		for(var x in this.drinkWords){
			this.tweakedWords[x] = this.drinkWords[x].toLowerCase();
			if(x > 0)
				$("#drink_words").append(",");	
			$("#drink_words").append(" <em>" + this.drinkWords[x] + "</em>");	
		}
		$("#drink_words").append("<br /><br />");	
		
		
		// Activate drink button
		$("#drink_command").click(function() {
			TRANSCRIPT.drink();
		});
	},
	
	receivePayload: function(payload) {
		switch(payload.type) {
			// Module Payloads
			case COMMUNICATION_TRANSCRIPT_PAYLOAD_CONTENT:
				this.contentOut(payload.data);
				break;
			case COMMUNICATION_TRANSCRIPT_PAYLOAD_LINE:
				this.lineOut(payload.data);
				break;
			case COMMUNICATION_TRANSCRIPT_PAYLOAD_WORD:
				this.wordOut(payload.data);
				break;
		}
	},
	
	drink: function(trigger) {
		this.drinkTotal++;
		$("#drink_command").effect("highlight", {
			duration: 2000
		});
		if(!trigger)
			$("#drink_stats").append("Drank because you said so!");
		else
			$("#drink_stats").append("Drank because someone said '" + trigger + "'");
		
		$("#drink_stats").append(" (<strong>" + this.drinkTotal + "</strong> drinks had by all)");
		
		$("#drink_stats").append("<br />")
			.scrollTop($("#drink_stats").prop("scrollHeight"));
	},
	
	contentOut: function(data) {
	},
	lineOut: function(data) {
	},
	wordOut: function(data) {
		if(data.body.search(">>") != -1)
			$("#transcript").append("<br /><br />");
		
		var newWord = data.body.toLowerCase().replace(/[^a-z0-9]/g,"");
		var output = "";
		
		var shortTest = this.tweakedWords.indexOf(newWord) != -1;
		var longTest = this.tweakedWords.indexOf(this.previousWord + " " + newWord) != -1;
		
		if(shortTest || longTest) {
			if(shortTest)
				this.drink(data.body);
			if(longTest)
				this.drink(this.previousWord + " " + data.body)
		}
		
		// chance of swap
		var swap = Math.floor(Math.random() * 125) < Math.min(this.drinkTotal, 100);
		if(swap) {
			var x = Math.floor(Math.random() * (data.body.length - 1))
			var character = data.body.charAt(x);
			data.body = data.body.substr(0, x) + data.body.charAt(x+1) + data.body.substr(x + 1);
			data.body = data.body.substr(0, x + 1) + character + data.body.substr(x + 2);
		}
		
		for(var x = 0; x < data.body.length ; ++x) {
			var character = data.body.charAt(x);
			output += character;
			if(this.drinkTotal == 0)
				continue;
			
			// chance of *hic*
			var hic = Math.floor(Math.random() * 625) < Math.min(this.drinkTotal, 75);
			// chance of slur
			var slur = Math.floor(Math.random() * 750) < Math.min(this.drinkTotal, 125);
			if(hic) {
				output += "*hic*";
			}
			if(slur) {
				output += character;
				--x;
			}
		}
		
		$("#transcript").append(output + " ")
			.scrollTop($("#transcript").prop("scrollHeight"));
		
		this.previousWord = newWord;
	},
	
});

$(function() {
	window.TRANSCRIPT = new Transcript();
});