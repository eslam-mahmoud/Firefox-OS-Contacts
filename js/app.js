$(document).ready(function(){  
  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    alert('There is a problem, please contact us at contact@eslam.me');
  }
  
  $('#email').on('input', function() {
      $('#contact img').attr('src', "http://www.gravatar.com/avatar/"+md5($(this).val())+"?s=200");
  });
  
  $('#save').on('click', function(event){
    //Stop form submittion
    event.preventDefault();
    
    var name = $('#name').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var imgURL = $('#contact img').attr('src');
    
    var data = {
      name: name,
      phone: phone,
      email: email,
      imgURL: imgURL
    };
    
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
  
  var oReq = new XMLHttpRequest();
  console.log(oReq);
  oReq.onload = function (e) {
    console.log(0, person);
    console.log(this.response);
    var arrayBufferView = new Uint8Array(this.response);
    person.photo  = [];
    person.photo[0] = new Blob([arrayBufferView], {type: 'image/png'});
    console.log(1, person);
    savePerson(person)
  };
  
  oReq.onerror = function (e) {
    alert('Error could not get your contact image');
    $('#save.no_img').show();
  }

  oReq.open("GET", data.imgURL, true);
  oReq.responseType = "arraybuffer";
  oReq.send();
  
  
  console.log(2, person);
}

function savePerson(person) {
  // save the new contact
  var saving = navigator.mozContacts.save(person);

  saving.onsuccess = function() {
    alert('New contact saved');
    // This update the person as it is stored
    // It includes its internal unique ID
    // Note that saving.result is null here
  };

  saving.onerror = function(err) {
    alert('Error: ' + err);
  };
}