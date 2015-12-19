if (Meteor.isClient) {
  Meteor.startup(function(){
    // counter starts at 0
    var storedState = localStorage.getItem('elm-todo-state');
    var startingState = storedState ? JSON.parse(storedState) : null;
    var todomvc = Elm.fullscreen(Elm.Todo, { getStorage: startingState });
    todomvc.ports.focus.subscribe(function(selector) {
        setTimeout(function() {
            var nodes = document.querySelectorAll(selector);
            if (nodes.length === 1 && document.activeElement !== nodes[0]) {
                nodes[0].focus()
            }
        }, 50);
    });
    todomvc.ports.setStorage.subscribe(function(state) {
        localStorage.setItem('elm-todo-state', JSON.stringify(state));
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
