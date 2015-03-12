/*jslint node: true */
"use strict";

var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
var main_state = {

	preload: function () {
        this.game.load.image('backround', 'assets/background.png');
		this.game.load.image('george', 'assets/george.gif');
        this.game.load.image('pipe', 'assets/pipe.png');
    },

    create: function () {

		this.game.add.sprite(0, 0, 'backround');
		
		this.george = this.game.add.sprite(100, 245, 'george');
        this.george.body.gravity.y = 1000;
		
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
		game.input.onTap.add(this.jump, this);
		
        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');

        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

		this.score = -1;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(200, 20, "0", style);
		  
		this.game.state.start('main_state');
    },
    
    update: function () {
		if (this.george.inWorld === false) {
			this.restart_game();
		}
        
		this.game.physics.overlap(this.george, this.pipes, this.restart_game, null, this);
	},

    jump: function () {
        this.george.body.velocity.y = -350;
    },

    restart_game: function () {
        this.game.time.events.remove(this.timer);
        this.game.state.start('main');
    },

    add_one_pipe: function (x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function () {
        var hole = Math.floor(Math.random() * 5) + 1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.add_one_pipe(400, i*60+10);
    
        this.score += 1;
        this.label_score.content = this.score;
    },
};

game.state.add('main', main_state);
game.state.start('main');
