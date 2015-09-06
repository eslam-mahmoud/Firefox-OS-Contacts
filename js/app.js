

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

function reqListener(person){
  console.log(0, person);
  person.photo  = [];
  console.log(this.response);
  var arrayBufferView = new Uint8Array(this.response);
  person.photo[0] = new Blob([arrayBufferView], {type: 'image/png'});
  console.log(1, person);
  savePerson(person)
}

function saveContact(data, blob){
  var person = new mozContact();
  person.name  = [data.name];
  person.givenName = [data.name];
  
  person.tel = [];
  person.tel[0]  = {type:['mobile'], value:data.phone};
//   person.tel[0]  = {type:{0:'mobile'}, value:data.phone};
  
  person.email = [];
  person.email[0]  = {type:['work'], value:data.email};
//   person.email[0]  = {type:{0:'work'}, value:data.email};
  
  var oReq = new XMLHttpRequest();
    oReq.onload = function (e) {
      console.log(0, person);
      person.photo  = [];
      console.log(this.response);
      var arrayBufferView = new Uint8Array(this.response);
      person.photo[0] = new Blob([arrayBufferView], {type: 'image/png'});
      console.log(1, person);
      savePerson(person)
    };
//   oReq.addEventListener("load", reqListener(person));
  //   oReq.open("GET", 'http://www.gravatar.com/avatar/6278db4c91c6c2d91f1c7201d8e2f564?s=200', false);
  oReq.open("GET", data.imgURL, true);
  oReq.responseType = "arraybuffer";
  oReq.send();
  
//   if (oReq.status == 200) {
//     person.photo  = [];
//     var arrayBufferView = new Uint8Array(oReq.responseText);
//     person.photo[0] = new Blob([arrayBufferView], {type: 'image/png'});
//   }
  
  console.log(2, person);
  
//   if ("init" in person) {
//     // Firefox OS 1.2 and below uses a "init" method to initialize the object
//     person.init(contactData);
//   }

//   // save the new contact
//   var saving = navigator.mozContacts.save(person);

//   saving.onsuccess = function() {
//     console.log('new contact saved');
//     // This update the person as it is stored
//     // It includes its internal unique ID
//     // Note that saving.result is null here
//   };

//   saving.onerror = function(err) {
//     console.error('error', err);
//   };
}

function savePerson(person) {
    // save the new contact
  var saving = navigator.mozContacts.save(person);

  saving.onsuccess = function() {
    console.log('new contact saved');
    // This update the person as it is stored
    // It includes its internal unique ID
    // Note that saving.result is null here
  };

  saving.onerror = function(err) {
    console.error('error', err);
  };
}