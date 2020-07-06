/**
 * author: miek
 * contact: special.michael@gmail.com
 * provides: wrapped access to the preferences.
 *
 * for the future: 
 *    maybe cache the prefservice
 *    add int and bool versions, and maybe complex.
 *
 * $Log: signaturePreferenceLib.js,v $
 * Revision 1.1  2004/12/31 15:44:03  test
 * fixes for the following:
 * Problem       : should be able to re-order signatures (move up and down)
 * Problem       : make work in thunderbird (phillip nichols, brian)
 * Problem       : in newest build getting replicated items in the generated menus
 * Problem       : Long signatures make obscure the name in the options dialog
 *
 */

ChromeUtils.import("resource://gre/modules/Services.jsm");
   
/**
 * looks up the preference service,stores the preference.
 * no checking is performed.
 */
function setPrefString(absolutePrefPath, value){
   
  //and the top level (as using the absolute path)
    
  Services.prefs.setStringPref(absolutePrefPath, value);
  
}//setPrefString()

/**
 * looks up the preference service, looks up the preference, returns it.
 * if the preference doesn't exist,or is not a string, will return null;
 */
function getPrefString(absolutePrefPath){

  var value = Services.prefs.getStringPref(absolutePrefPath);

  return value;
}//getPrefString()

/**
 * returns the default names 
 * (initial value/value when no others are found)
 */
function defaultNames(){
  //CETE
  //return "Par défaut";
  return "Par d\u00e9faut";
  //FIN CETE
}


/**
 * returns the default signatures 
 * (initial value/value when no others are found)
 */
function defaultSignatures(){

  //CETE
  var accman=Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
  var ident=accman.defaultAccount.defaultIdentity;
  var nom=ident.fullName;
  var org=ident.organization;
  
  //nom a en principe 2 formes possibles:
  //NOM Prenom - Organisation
  //PARTAGE - Organisation emis par NOM Prenom - Organisation
  var signe=nom;
  if (org && ""!=org){
    var cn="";
    var tab=nom.split(" emis par ");
    if (1<tab.length){
      cn=tab[1];
    }
    else{
      cn=nom;
    }
    
    tab=cn.split(" - ");
    if (1<tab.length){
      signe=tab[0]+"\n\n"+org;
    }
  }
  
  return signe;
  //FIN CETE
  /*
  return "special.michael@gmail.com (authors email)"
    +"`"+
    "some people ask why [\\n] isn't supported, \n"+
    "it's because it's simpler than that, use the [enter] key ";
    */
}



//CETE
/**
*  Fonction : initPrefences
*  Role: crée les préférences signature.names et signature.signatures
*  si elles n'existent pas.
*  Initialise les valeurs par défaut si nécessaire (création ou vide)
*  Fonction appelée par sig_windowLoad()
*
*/
function initPrefences(){
  
  var prefs=Services.prefs.getBranch("");

  //création des préférences
  var noms=null;
  var valeurs=null;

  if (prefs.prefHasUserValue("signature.names")){
    noms=prefs.getStringPref("signature.names");
  }

  if (prefs.prefHasUserValue("signature.signatures")){
    valeurs=prefs.getStringPref("signature.signatures");
  }

  if (null==noms || ""==noms){

    noms=defaultNames();
    valeurs=defaultSignatures();
    
    prefs.setStringPref("signature.names", noms);

    prefs.setStringPref("signature.signatures", valeurs);
  }
}
//FIN CETE