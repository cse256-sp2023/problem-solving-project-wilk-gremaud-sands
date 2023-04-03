// ---- Define your dialogs  and panels here ----
var new_perms = define_new_effective_permissions("permissions-panel", true);
$('#sidepanel').append(new_perms);
$('#permissions-panel').attr('filepath', "");
var new_user = define_new_user_select_field("user", 'Select User', function(selected_user) {$('#permissions-panel').attr('username', selected_user);});
$('#sidepanel').append(new_user);
$('#sidepanel').append($('<p>To check the permissible actions for a user for any given file, select a user and then select any file.</p>'));
$('#wrapper').append($('<br><br><p>How do file permissions work? <br><br> A user has a list of permissible actions for a given file or folder. These permissions may be set according to that file or folder, or they may inherit permission rules from a parent folder. <br> For example, if you find that a user can access only one file in a folder, it may be that the user was only given access to that single file and lacks allow permissions for the parent folder.</p>'));

$('.perm_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Permission");
    new_dialog.dialog('open');

    let my_filename_var = $('#permissions-panel').attr('filepath');
    let my_user_var = $('#permissions-panel').attr('username');
    let my_permission = $(this).attr('permission_name');

    let my_file_obj_var = path_to_file[my_filename_var];
    let my_user_obj_var = all_users[my_user_var];
    
    let explanation = allow_user_action(my_file_obj_var, my_user_obj_var, my_permission, true);

    let explanation_text = get_explanation_text(explanation);

    new_dialog.text(explanation_text);
});

$('.permdialog_deny_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Override Capabilities of Deny");
    new_dialog.dialog('open');

    let explanation_text = "DENY IS MORE POWERFUL THAN ALLOW! \n Marking deny for a user will disallow the user from that action, regardless of any allow permissions they may have previously inherited."

    new_dialog.text(explanation_text);
});

$(document).on( "click", '.file', function() {
    //when click on file, show permissions for the selected user
    //user must be selected for permissions to show
    var fp = $(this).attr('id');
    $('#permissions-panel').attr('filepath', fp.substring(0, fp.length-4));
    
    //when file is selected, change background color to highlight
    $('.file').css("background-color", "white");
    $('.file').css("color", "black");
    $(this).css("background-color", "#007fff");
    $(this).css("color", "white");
});

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 
$('.permbutton').append('Permissions')