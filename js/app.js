$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
});

$(document).ready(function(){  
  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    alert('There is a problem, please contact us at contact@eslam.me');
  }
  
  //Open all external links in the browser
  $('a[href^=http]').click(function(e){
      e.preventDefault();
      var activity = new MozActivity({
        name: "view",
        data: {
          type: "url",
          url: $(this).attr("href")  
        }
      });
   });
  
  //Get the image of the email from gravatar
  $('#email').on('input', function() {
      $('#contact img').attr('src', "http://www.gravatar.com/avatar/"+md5($(this).val())+"?s=200&d=monsterid");
  });
  
  //Button clicked
  $('#save, #save_no_img').on('click', function(event){
    //Stop form submittion
    event.preventDefault();
    
    var name = $('#name').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var imgURL = $('#contact img').attr('src');
    
    if (!name || !phone) {
      alert('Name & Phone are required');
      return;
    }
    
    var data = {
      name: name,
      phone: phone,
      email: email,
      imgURL: imgURL
    };
    
    //Remove the image if could not download it
    if ($(this).attr('id') == 'save_no_img') {
      data.imgURL = null;
    }
    
    //Save the data
    saveContact(data);
  });
});

function saveContact(data, blob){
  var person = new mozContact();
  person.name  = [data.name];
  person.givenName = [data.name];
  
  person.tel = [];
  person.tel[0]  = {type:['mobile'], value:data.phone};
  
  person.email = [];
  person.email[0]  = {type:['work'], value:data.email};
  
  //If there image try to download it then save the contact
  if (data.imgURL) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function (e) {
      var arrayBufferView = new Uint8Array(this.response);
      person.photo  = [];
      person.photo[0] = new Blob([arrayBufferView], {type: 'image/png'});
      //Save the contact to contacts list
      savePerson(person);
    };

    //IF there was error loading the image display the other button for download
    oReq.onerror = function (e) {
      alert('Error could not get your contact image');
      $('#save_no_img').attr('style','display:table');
    }

    oReq.open("GET", data.imgURL, true);
    oReq.responseType = "arraybuffer";
    oReq.send();
  } else {
    savePerson(person)
  }
}

//Save the contact into contact list
function savePerson(person) {
  // save the new contact
  var saving = navigator.mozContacts.save(person);

  //Alert the user if the contact saved
  saving.onsuccess = function() {
    alert('New contact saved');
    init();
  };

  //Get if there was error and display the message
  saving.onerror = function(err) {
    console.log(err.target.error);
    if (err.target.error.message) {
     alert('Error: ' + err.target.error.message);
    } else if (err.target.error.name == 'PERMISSION_DENIED') {
     alert('Error: We need your permission to add new contact, please allow the app to add contacts');
    } else {
      alert('Error, Please contact us at contact@eslam.me');
    }
  };
}

//Reset the app after saving
function init() {
  $('#contact input').val(null);
  $('#save_no_img').hide();
  $('#contact img').attr('src', '/img/face.jpg');
}