

/* adds event listener for popup menus */
window.addEventListener("load",sig_windowLoad,true);

//add listener to generate the menu
function sig_windowLoad(){
  //CETE
  initPrefences();
  //FIN CETE
  
  if( document.getElementById("contentAreaContextMenu")){
    document.getElementById("contentAreaContextMenu")
      .addEventListener("popupshowing",sig_menuPopup,false);  
  } //if
  if(document.getElementById("msgComposeContext")){
    document.getElementById("msgComposeContext")
      .addEventListener("popupshowing",sig_setMenu,false);
  } //if
} //sig_windowLoad


//this is the function that does the menu generation
function sig_menuPopup() {
  /*
   * I think this was taken from BBCode extension, 
   *  http://www.jedbrown.net/
   * cheers man :D
   */
  
  // only do this if it's on a text field
  var cm = gContextMenu;
  document.getElementById("signature-menu").hidden = !cm.onTextInput;
  
  //generate the menu.
  if (cm.onTextInput){
    sig_setMenu();
  } //if
} // sig_menuPopup


//sets the menu to the current preferences.
function sig_setMenu(){

  //get the template item (also my mutex)
  var menu_template = document.getElementById("sig_menu_item_template");
  var options_item = document.getElementById("sig_menu_options");
  var seperator = document.getElementById("sig_menu_seperator");
  //CETE:desactiver
  //var random_item = document.getElementById("sig_menu_random");
  //FIN CETE

  //empty the list of all previous menu items
  var menu= menu_template.parentNode;
  var children = menu.childNodes;
  var temp;
  for(var i= children.length-1; i>0; i--){
    menu.removeChild( children.item(i));
  }//for

  
  //get the preferences
  var n= getPrefString("signature.names");
  var s= getPrefString("signature.signatures");
 // if (n==null || n== ""){n= defaultNames(); s= defaultSignatures();}
  

  
  //split the string into an array of signatures.
  var names= n.split("`");
  var signatures= s.split("`");    
  var len = names.length;
  
 
  menu_template.hidden= false;
  
  for(var i= 0; i<len; i++){        
    menu_template.label=names[i];
    menu_template.value=signatures[i];
    
    var new_item = menu_template.cloneNode(true);
    menu.appendChild(new_item);

  } // for i < len   
  
  //replace the options menu, the seperator, the random bit and the template
  menu_template.hidden= true;
  menu.appendChild(menu_template);

 
  seperator.hidden = false;
  menu.appendChild(seperator);

  //CETE:desactiver
  //random_item.hidden= false;
  //menu.appendChild(random_item);
  //FIN CETE
  
  options_item.hidden= false;
  menu.appendChild(options_item);

} //sig_setMenu 


/*
 * this was taken from BBCode extension, 
 *  http://www.jedbrown.net/
 * cheers man :D
 */
function sig_menu_insert(text){
  
  try {
    //CETE  
    var editeur=document.getElementById("content-frame");
    editeur=editeur.getEditor(editeur.contentWindow);
    var editxt=editeur.QueryInterface(Components.interfaces.nsIPlaintextEditor);
    editxt.insertText(text);
    //FIN CETE
  }catch (e) {
    dump("Can't do cmd_insertText! ");
    dump(e+"\n");
  }
  
} 
/*
function sig_menu_insert(text){
  
  try {
    var command = "cmd_insertText";
    var controller = 
      document.commandDispatcher.getControllerForCommand(command);
    
    if (controller && controller.isCommandEnabled(command)) {
      controller = 
  controller.QueryInterface(
          Components.interfaces.nsICommandController
          );
      var params = 
  Components.classes["@mozilla.org/embedcomp/command-params;1"];
      params = 
  params.createInstance(Components.interfaces.nsICommandParams);
      
      params.setStringValue("state_data", text);
      controller.doCommandWithParams(command, params);
    }
  }catch (e) {
    dump("Can't do cmd_insertText! ");
    dump(e+"\n");
  }
  
} //sig_menu_insert()

*/

function sig_defaultSignature(){
  var n= getPrefString("signature.names");
  var s= getPrefString("signature.signatures");
  
  var names = n.split("`");
  var signatures= s.split("`");
  var len = names.length;
  
  //CETE
  for ( var i = 0; i<len; i++){
    //if(names[i] == "Par défaut"){
    if(names[i] == "Par d\u00e9faut"){
      return signatures[i];
    }
  }
  //FIN CETE
  
  for ( var i = 0; i<len; i++){
    if(names[i] == "default"){
      return signatures[i];
    }
  }

  return "---------------------\n"
  +"no default signature found. create a signature called `default` \n"
  +" and then when you use this shortcut it will insert that signature "
  +"---------------------\n";
}

function sig_random() {
  //get the preferences
  var s= getPrefString("signature.signatures");

  //split the string into an array of signatures.
  var signatures= s.split("`");    
  return signatures[Math.floor(Math.random()*signatures.length)];
}