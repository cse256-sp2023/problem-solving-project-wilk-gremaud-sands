// ---- Define your dialogs  and panels here ----
// var new_perms = define_new_effective_permissions("permissions-panel", true);
// $('#sidepanel').append($('<p>To check the permissible actions for a user for any given file, select a user and then select any file from the left panel.</p>'));
// $('#sidepanel').append(new_perms);
// $('#permissions-panel').attr('filepath', "");
// var new_user = define_new_user_select_field("user", 'Select User', function(selected_user) {$('#permissions-panel').attr('username', selected_user);});
// $('#sidepanel').append(new_user);

//css and add instructions to every page
$('#filestructure').css("width", "100%");
$('#wrapper').append($('<br><br><div style="margin-left: 3vw;"><p>How do file permissions work? <br><br> A user has a list of permissible actions for a given file or folder. These permissions may be set according to that file or folder, or they may inherit permission rules from a parent folder. <br> For example, if you find that a user can access only one file in a folder, it may be that the user was only given access to that single file and lacks allow permissions for the parent folder.</p></div>'));
$('#adv_perm_entries_text').append("<span id=\"${id_prefix}_info_icon\" class=\"fa fa-info-circle permdialog_missing_users_info\"></span>");
$('#adv_permissions_tab').prepend("<p>To use inherited permissions, user(s) must first be added to the file/folder, and <i>then</i> inherited permissions may be turned on by checking \"Inherit Parent Permissions.\"\nSimilarly, inherited permissions must be removed from a user before removing them from a file/folder.</p><br>");

////////////////////////////
//  Permdialog popup boxes
///////////////////////////

//permission panel (unused)
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

//deny dialog info box
$('.permdialog_deny_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Override Capabilities of Deny");
    new_dialog.dialog('open');

    let explanation_text = "DENY IS MORE POWERFUL THAN ALLOW! \n Marking deny for a user will explicitly disallow the user from that action, regardless of any allow permissions they may have previously inherited.";

    new_dialog.text(explanation_text);
});

//missing users even though existing permissions (Hard 3)
$('.permdialog_missing_users_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Still Missing Permissions?");
    new_dialog.dialog('open');

    let explanation_text = "If you are seeing inherited permissions for users in the table below but are not seeing any permissions in the normal Permissions window, it may be that while the users have the permissions, they have not yet been added to the file/folder.";

    new_dialog.text(explanation_text);
});

$('.permdialog_perm_inherit_recommendation').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Inheritance");
    new_dialog.dialog('open');

    let explanation_text = "If you want this file/folder to have the same permissions as its parent folder, then the best way to do this is to use inherited permissions, which can be accessed in Advanced settings.";

    new_dialog.text(explanation_text);
});

// info boxes for standard permissions
$('.permdialog_Read_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Read");
    new_dialog.dialog('open');

    let explanation_text = "Read access refers only to a user's ability to view a file/folder and its subcontents. It does not include the user's ability to modify the file/folder, run the file, or change the contents of the file.";

    new_dialog.text(explanation_text);
});

$('.permdialog_Write_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Write");
    new_dialog.dialog('open');

    let explanation_text = "Write access refers to the user's ability to change the contents of the file.";

    new_dialog.text(explanation_text);
});

$('.permdialog_Read_Execute_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Read/Execute");
    new_dialog.dialog('open');

    let explanation_text = "Read/Execute access includes read permissions + the ability to run files.";

    new_dialog.text(explanation_text);
});

$('.permdialog_Modify_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Modify");
    new_dialog.dialog('open');

    let explanation_text = "Modify access refers to the user's ability to view and modify files and file properties, including deleting and adding files to a directory or file properties to a file.";

    new_dialog.text(explanation_text);
});

$('.permdialog_Full_control_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Full Control");
    new_dialog.dialog('open');

    let explanation_text = "Users with full control have all of the above permissions (Read, Write, Read/Execute, and Modify). They have full permissions for the file/folder.";

    new_dialog.text(explanation_text);
});

$('.permdialog_Special_permissions_info').click( function() {
    var new_dialog = define_new_dialog("dialog_1", "Learn about Special Permissions");
    new_dialog.dialog('open');

    let explanation_text = "Special Permissions refer to any specific permissions set in the advanced settings. This box will be ticked if any permissions are set in the advanced settings.";

    new_dialog.text(explanation_text);
});

//get file path on click
$(document).on( "click", '.file', function() {
    //when click on file, show permissions for the selected user
    //user must be selected for permissions to show
    var fp = $(this).attr('id');
    $('#permissions-panel').attr('filepath', fp.substring(0, fp.length-4));
    
    //when file is selected, change background color to highlight
    // $('.file').css("background-color", "white");
    // $('.file').css("color", "black");
    // $(this).css("background-color", "#007fff");
    // $(this).css("color", "white");
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