import session from './session.js';
import {gun} from './main.js';
import helpers from './helpers.js';


var vibes = window.vibes = {};

//Create a channel
function newVibe(pub, vibeLink) {
    if (!pub || Object.prototype.hasOwnProperty.call(vibes, pub)) {
        return;
    }

    const channel = new iris.Channel({gun, key: session.getKey(), chatLink: vibeLink, participants: pub});
    addVibe(channel);
}

//Add the channel to vibes[pub]
function addVibe(channel) {
    var pub = channel.getId();
    var element = $('<div> </div>');
    if (vibes[pub]) {return;}
    vibes[pub] = channel;
    element.attr('user-pub',pub);
    gun.user(pub).get('profile').get('username').on(async username => {
        vibes[pub].username = await username;
        element.text(vibes[pub].username);
        console.log(vibes[pub].username);
    });
    $('.user-list').append(element);
    console.log(vibes[pub]);
}

//Listen for paste function and create channel
function onPasteVibeLink(event) {
    var val =  $(event.target).val();
    if (val.length < 30) { return; }
    var s = val.split('?');
    if (s.length !==2) { return; }
    var vibeId = helpers.getUrlParameter('chatWith', s[1]) || helpers.getUrlParameter('channelId', s[1]);

    if (vibeId) {
        newVibe(vibeId, val);
    }
    console.log("Successfully shared");
    $(event.target).val('');
}

function init() {
    $("#paste-vibe-link").on('input', onPasteVibeLink);
    
}

export {init, addVibe, newVibe}
export default {init, addVibe, newVibe}
