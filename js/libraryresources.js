let requestURL = "https://sdat-dev.github.io/resources/wecliemprep/data/libraryresources.json";
let datarequestURL = "https://sdat-dev.github.io/resources/wecliemprep/data/libraryresourcesdata.json";
let request = axios.get(requestURL);
let datarequest = axios.get(datarequestURL);
axios.all([request, datarequest]).then(axios.spread((...responses) => {
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    //condition for checking if browser is Internet Explorer
    let webelements = responses[0].data;
    let libraryresources = responses[1].data;
    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    contentElement.innerHTML = getContent(webelements);
    maincontentContainer.appendChild(contentElement);
    addLibraryResources(libraryresources);
    addfooter();

})).catch(errors => {
    console.log(errors);
})

let addLibraryResources = function(libraryresources){
    let agencies_sort = ['NSF​','NIH','DoD','DOE','ED','NASA','NOAA','NEA','NEH','NIJ','SAMHSA','USDA']
    let distinctAgencies = getDistinctAttributes(libraryresources, 'acronym');
    distinctAgencies = customSort(agencies_sort, distinctAgencies);

    let navContent = createAgencyNavigation(distinctAgencies);
    let tabContent = buildAgencyLibResources(distinctAgencies, libraryresources);
    updatecontentHeading("Library Resources");
    let maincontentContainer = document.getElementsByClassName('main-content')[0];
    appendMainContent(maincontentContainer, navContent + tabContent);
}

let createAgencyNavigation = function(distinctAgencies)
{
    let navigationContent = '<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">';
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let buttonContent = '';
        let agencyId = "agency" + i.toString();
        if(i == 0)
        {
            buttonContent = '<a class="nav-link active" id="pills-'+ agencyId +'-tab" data-toggle="pill" href="#pills-'+ agencyId +'" role="tab" aria-controls="pills-'+ agencyId +'" aria-selected="true">'+ distinctAgencies[i] +'</a>';
        }
        else
        {
            buttonContent = '<a class="nav-link" id="pills-'+ agencyId +'-tab" data-toggle="pill" href="#pills-'+ agencyId +'" role="tab" aria-controls="pills-'+ agencyId +'" aria-selected="true">'+ distinctAgencies[i] +'</a>';
        }
       
        let linkElement = '<li class="nav-item">' + buttonContent + '</li>';
        navigationContent = navigationContent + linkElement;
    }
    navigationContent += '</ul>';
    return navigationContent;
}

let buildAgencyLibResources = function(distinctAgencies, libraryresources){
    let tabContent = '<div class="tab-content" id="pills-tabContent">';
    
    for(let i = 0; i< distinctAgencies.length; i++)
    {
        let agencyId = "agency" + i.toString();
        let agencyresources = libraryresources.filter(function(libraryresource){
            return libraryresource.acronym == distinctAgencies[i];
        });

        if(i == 0)
        {
            tabContent +='<div class="tab-pane fade show active" id="pills-'+ agencyId +'" role="tabpanel" aria-labelledby="pills-'+ agencyId +'-tab">';
        }
        else
        {
            tabContent +='<div class="tab-pane fade" id="pills-'+ agencyId +'" role="tabpanel" aria-labelledby="pills-'+ agencyId +'-tab">';
        }

        if(agencyresources[0].acronym != 'General')
            tabContent += '<h3 class="sponsor-title"><img class="logo" src="assets/sponsor_logos/'+ agencyresources[0].acronym.toLowerCase() +'.png">'+ agencyresources[0].agency.toString() +'</h3>';
        agencyresources.forEach(function(agencyresource) {
            tabContent += buildResourceInfo(agencyresource);
        });

        tabContent += '</div>';
        addfooter();
    }
    tabContent += '</div>';
    return tabContent;
    
}

let buildResourceInfo = function(resource){
    let content = '';
    content +=  '<div class="display-flex bookinfo search-container">' +
                    '<div class="col-xl-2 col-lg-3 ml-0 pl-0">'+
                        '<img class="book-cover" src="assets/images/Book-Covers/'+ resource.image +'">'+
                    '</div>'+
                    '<div class="col-xl-10 col-lg-9 p-0">' +
                        '<h4 class="booktitle"><a href="' + resource.link + '"';
    if(resource.type == 'eBooks')
        content +=      '   target="_blank"><i class="fas fa-file-pdf"></i> '+ resource.title+'</a></h4>';
    else
        content +=      '   target="_blank"><i class="fas fa-book"></i> '+ resource.title+'</a></h4>'; 
    content +=          '<p><i class="fas fa-user"></i> <strong>Author: </strong>'+ resource.author +'</p>'+
                        '<p><i class="fas fa-calendar-day"></i> <strong>Published Year: </strong>'+ resource.year +'</p>'+
                    '</div>'+
                '</div>';    
    return content;
}


$('.carousel').carousel({
    pause: "false",
    interval: 2000

});