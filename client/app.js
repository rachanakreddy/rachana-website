//wrapping entire file in function for jQuery
(function() {
    var blackKeys = {1: 1, 3: 3, 6: 1,8: 2,10: 3};
    $.each(blackKeys, function(k, v) {
        blackKeys[k] = ' black black'+ v;;
    });

    function blackKeyClass(i) {
        return blackKeys[(i % 12) + (i < 0 ? 12 : 0)] || '';
    }

    var $keys = $('<div>', {'class': 'keys'}).appendTo('#piano');
    var pianoBuilt = false;

    function buildPiano() {
        if (pianoBuilt) return;
        pianoBuilt = true;

        $keys.trigger('build-start.piano');
        $keys.empty().off('.play');

        function buildKey(i){
            var dataURI = Notes.getDataURI(i);
            var sounds = new Audio(dataURI);
            var pressedTimeout;
            dataURI = null;

            function play(e){
                sounds.pause();
                sounds.currentTime = 0.001
                sounds.play();

                var $key = $keys.find('[data-key='+i+']').addClass('pressed');
                $keys.trigger('played-note.piano', [i, $key]);

                window.clearTimeout(pressedTimeout);
                pressedTimeout = window.setTimeout(()=> {
                    $key.removeClass('pressed');
                }, 200);
            }

            $keys.on('note-' + i + '.play', play);
            var $keyDiv = $('<div>', {
                'class': 'key' + blackKeyClass(i),
                'data-key' : i,
                mousedown : function(e) {$keys.trigger('note-' + i + '.play'); }
            }).appendTo($keys);
        } //end of building key function
        
        var i = -12, max = 14;
        var addDelay = /Chrome/i.test(navigator.userAgent) ? 80 : 0;
        (function go(){
            buildKey(i);
            if (++i < max) { window.setTimeout(go, addDelay);}
            else {
                pianoBuilt = false;
                $keys.trigger('build-done.piano');
            }

        })();
    }

    buildPiano();

    var keyNotes = {65:0, 87:1, 83:2, 69:3, 68:4, 70:5, 84: 6,
        71:7, 89:8, 72:9, 85:10, 74:11, 75:12, 79:13, 76:14,
        80:15, 186:16, 59:16, 222:17, 221:18, 13:19};

    var downKeys = {};

    function isModifierKey(e){
        return e.metaKey || e.shiftKey || e.altKey;
    }

    $(window).keydown( function(e) {
        var keyCode = e.keyCode;
        if(!downKeys[keyCode] && !isModifierKey(e)){
            downKeys[keyCode] = 1;
            var key = keyNotes[keyCode];
            if (typeof key != 'undefined') {
                $keys.trigger('note-'+(key-12)+'.play');
                e.preventDefault();
            }
        }
    }).keyup(function(e) {delete downKeys[e.keyCode]});

    // prevent quick find...
    $(window).keydown(function(e) {
        if (e.target.nodeName != 'INPUT' && e.target.nodeName != 'TEXTAREA') {
            if (e.keyCode == 222) {
                e.preventDefault();
                return false;
            }
        }
        return true;
    });

})();
