// ======================================
// Author : Sagar Dolui
// Email  : sagar03d@gmail.com
//========================================

var jQueryScript = document.createElement('script');  
jQueryScript.setAttribute('src','https://cdn.jsdelivr.net/npm/sweetalert2@11');
document.head.appendChild(jQueryScript);

$('form').each(function(){
    let formid = $(this).closest("form").attr('id');
    let ignore = $(this).closest("form").data('ignore');
    if(!ignore){
    $("form#"+formid).on('submit', function(e){
         let btnval = $(".savebtn").text();
         let redirect = $(this).attr('data-redirect');
         $(".savebtn").html('Please Wait...');
         $(".savebtn").attr('disabled', true);
         $('.errormessage').html('');
         $('.error').each(function(){
             $(this).removeClass('error');
             $(this).removeClass('is-invalid');
         });
         
         if( typeof(CKEDITOR) !== "undefined" )
         {
             for ( instance in CKEDITOR.instances )
                 CKEDITOR.instances[instance].updateElement();
         }

         var formData = new FormData(this);
         $.ajax({
             headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
             method      : 'POST',
             data        : formData,
             url         : $(this).attr('action'),
             processData : false, // Don't process the files
             contentType : false, // Set content type to false as jQuery will tell the server its a query string request
             dataType    : 'json',
             success     : function(response){
                 if(response.success == true)
                 {
                     swal.fire({   
                             title: "Success",   
                             text: response.message,   
                             icon: "success",   
                             showCancelButton: false,
                             showConfirmButton: false,
                             timer: 1500
                     });
                     
                     if(typeof response.redirect !== 'undefined'){
                        setTimeout(() => {
                            window.location.href=response.redirect;
                         }, 1000);
                     }
                     else{
                        setTimeout(() => {
                            window.location.href=redirect;
                         }, 1000);
                     }
                 }
                 else
                 {
                    swal.fire({   
                        title: "Error",   
                        text: response.message,   
                        icon: "error", 
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 1500
                    });
                     $(".savebtn").html(btnval);
                     $(".savebtn").attr('disabled', false);
                 }
             },
             error       : function(data){
                 var errors = $.parseJSON(data.responseText);
                 $.each(errors.errors, function(index, value) {
                     $('[name="'+index+'"]').addClass('error is-invalid');
                     if($('[name="'+index+'"]').length)
                     {
                         $('[name="'+index+'"]').after('<span class="text-danger errormessage">'+value+'</span>');
                     }
                     else
                     {
                        $('[name="'+index+'[]"]').after('<span class="text-danger errormessage">'+value+'</span>');
                     }
                 });
                 $(".savebtn").html(btnval);
                 $(".savebtn").attr('disabled', false);
             }
 
      });
         return false;
     });
    }
});

var DeleteRecord = function(){
        var action = $(this).data('action');
            
        swal.fire({   
            title: "Do you really want to delete ?",   
            text: "",   
            icon: "warning",   
            showCancelButton: true,
            showConfirmButton: true, 
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "Yes, Delete it!",
            confirmButtonColor: "#FF0000"
        });
        $(".swal2-confirm").unbind().on('click', function(){
            $.ajax({
                headers   :{'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
                method      : 'delete',
                url         : action,
                //processData : false, // Don't process the files
                //contentType : false, // Set content type to false as jQuery will tell the server its a query string request
                dataType    : 'json',
                success     : function(response){
                    if(response.success == true)
                    {
                        swal.fire({   
                                title: "Success",   
                                text: response.message,   
                                icon: "success",   
                                showCancelButton: false,
                                showConfirmButton: false,
                                timer: 1500
                        });

                        setTimeout(() => {
                            window.location.reload();
                         }, 1000);
                    }
                    else
                    {
                        swal.fire({   
                            title: "Error",   
                            text: response.message,   
                            icon: "error",
                            showCancelButton: false,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                },
                error       : function(data){
                    var errors = $.parseJSON(data.responseText);
                    $.each(errors, function(index, value) {
                        $.notify(""+value+"", {type:"danger"});
                    });
                }
            });
        });
    }
