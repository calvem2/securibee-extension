function dropdownOnClick() {
    // add onclick to drop downs
    let dropdowns = document.getElementsByClassName("dropdown-container");
    for (let i = 0; i < dropdowns.length; i++) {
        let dropdown = dropdowns[i];

        // add onclick to dropdown title and arrow
        dropdown.children[0].onclick = function() {
            // get children
            let arrow = this.children[1].firstChild;
            let content = this.parentElement.children[1];
            if (arrow.classList.contains("down")) {
                arrow.classList.remove("down");
                arrow.classList.add("up");
                content.style.display = "block";
            } else {
                arrow.classList.add("down");
                arrow.classList.remove("up");
                content.style.display = "none";
            }
        }
    }
}


