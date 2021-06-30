var SubmitForm = function(){
        $(".savebtn").html('Please Wait...');
        $(".savebtn").attr('disabled', true);
        $('.errormessage').html('');
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
                            timer: 2000
                    });
                    let redirect = arguments[0];
                    if(redirect)
                    {
                        window.location.href=redirect;
                    }
                    else
                    {
                        window.location.reload();
                    }
                }
                else
                {
                    $.notify(""+response.data+"", {type:"danger"});
                    $(".savebtn").html('Save');
                    $(".savebtn").attr('disabled', false);
                }
            },
            error       : function(data){
                var errors = $.parseJSON(data.responseText);
                $.each(errors.errors, function(index, value) {
                    $('[name="'+index+'"]').after('<span class="text-danger errormessage">'+value+'</span>');
                });
                $(".savebtn").html('Save');
                $(".savebtn").attr('disabled', false);
            }

        });
        return false;
    }

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
                                timer: 1000
                        });
                        window.location.href="";
                        
                    }
                    else
                    {
                        $.notify(""+response.data+"", {type:"danger"});
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
