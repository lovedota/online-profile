define(function() {
    return [
        {
            id: "ngocdung",
            firstName: "Dũng",
            middleName: "Ngọc",
            lastName: "Hoàng",
            photoUrl: "../photos/dung.jpg",
            roles: [
                "Front-End Developer",
                "Web Developer",
                "UI Developer"
            ],
            skills: {
                frontend: [
                    "AngularJS",
                    "DurandalJS",
                    "KnockoutJS",
                    "RequireJS",
                    "TypeScript",
                    "JQuery",
                    "PhoneGap"
                ],
                backend: [
                    "C#",
                    "Asp.Net",
                    "WCF",
                    "WebAPI",
                    "Mvc Framework",
                    "Sql Server",
                    "RavenDb"
                ]
            },
            history: {
                periods:[
                    {
                        id: 0,
                        title: "Evolution Software",
                        startDate: new Date(2012, 6, 16),
                        endDate: new Date(2014, 7, 5)
                    },
                    {
                        id: 1,
                        title: "DestinoAS",
                        startDate: new Date(2011, 4, 10),
                        endDate: new Date(2012, 5, 12)
                    },
                    {
                        id: 2,
                        title: "Lac Viet",
                        startDate: new Date(2010, 7, 20),
                        endDate: new Date(2011, 4, 3)
                    },
                    {
                        id: 3,
                        title: "Letterbip",
                        startDate: new Date(2009, 9, 15),
                        endDate: new Date(2010, 7, 1)
                    },
                    {
                        id: 4,
                        title: "DitechDesign",
                        startDate: new Date(2009, 2, 15),
                        endDate: new Date(2009, 8, 11)
                    }
                ],
                details: [
                    {
                        id: 0,
                        startDate: new Date(2012, 6, 16),
                        endDate: new Date(2014, 7, 5),
                        contents: [
                            {
                                startDate: new Date(2013, 8, 21),
                                endDate: new Date(2014, 7, 5),
                                title: "Evolution ERP Project",
                                slideshowOptions: {
                                    captionColor: "#0000ff"
                                },
                                description: "<p><b>Position:</b> Senior UI Developer.</p>" +
                                    "<p><b>Technology:</b> Typescript, AngularJs, CQRS, Mvc Framwork (Razor), Amd Modular Javascript (RequireJS), RavenDB, Css 3, Html 5.</p>" +
                                    "<p><b>Description:</b> Very big project for 5 years. It is the Single Page Application helping user easily to use like window application. There are some big modules: Tendency, Inventory Forecast, Accouting, CorrespondingSystem… This project use all the latest technology at this time. One of the first ERP using Web Application. Upgrade to AngularJs.</p>",
                                screenshots: [
                                    {title: "Dashboard", description: "Use to manage all the sticky notes, all modules, all notifications from system.", imageUrl: "../photos/evolution-dashboard.png"},
                                    {title: "Menu Bar", description: "Use for show the menu", imageUrl: "../photos/evolution-menu.png"},
                                    {title: "Create Edit Location", description: "Use for creating Location on Warehouse", imageUrl: "../photos/evolution-create-edit-location.png"},
                                    {title: "Manage Location", description: "Use for manage Locations and filter by Warehouse, Organization", imageUrl: "../photos/evolution-manage-locations.png"},
                                    {title: "Manage Batch Criteria", description: "Use for manage the Criteria for Batch", imageUrl: "../photos/evolution-manage-batch-criteria.png"},
                                    {title: "Manage Pick List", description: "Use for manage Locations and filter by Warehouse, Organization, Criteria, ShipViaCode", imageUrl: "../photos/evolution-manage-pick-list.png"},
                                    {title: "Report Pick", description: "Use for report the picking product in Batch", imageUrl: "../photos/evolution-report-pick.png"}
                                ]
                            },
                            {
                                startDate: new Date(2012, 6 , 16),
                                endDate: new Date(2013, 8, 20),
                                title: "Inventory Forecast Project",
                                slideshowOptions: {
                                    captionColor: "#0000ff"
                                },
                                description: "<p><b>Position:</b> UI Developer.</p>" +
                                    "<p><b>Technology:</b> KnockoutJS, CQRS, Mvc Framwork (Razor), Amd Modular Javascript (RequireJS), SqlServer, Css 3, Html 5.</p>" +
                                    "<p><b>Description:</b> Make an Inventory Forecast Web Report with Chart for the current WinForm Erp System. </p>",
                                screenshots: [
                                    {title: "Main Report", description: "This page contains all the charts to report the stock, missing quantities", imageUrl: "../photos/inventory-forecast-main-report.png"},
                                    {title: "Sub Report Curves", description: "This page is the detail for specific report by chart", imageUrl: "../photos/inventory-forecast-curves.png"},
                                    {title: "Sub Report Received vs Sales", description: "This page is the detail for specific report by number", imageUrl: "../photos/inventory-forecast-receivedvssales.png"},
                                    {title: "Forecast", description: "Use to forecast in future", imageUrl: "../photos/inventory-forecast-forecast-page.png"}
                                ]
                            }
                        ]

                    },
                    {
                        id: 1,
                        startDate: new Date(2011, 4, 10),
                        endDate: new Date(2012, 5, 12),
                        contents: [
                            {
                                startDate: new Date(2012, 1, 8),
                                endDate: new Date(2012, 5, 12),
                                title: "Functravel Project",
                                slideshowOptions: {
                                    captionColor: "orange"
                                },
                                description: "<p><b>Position:</b> Senior Developer</p>" +
                                    "<p><b>Technology:</b>KnockoutJS, WcfServer, SqlServer, Load Balance</p>" +
                                    "<p><b>Description: </b><a href='www.functravel.com'>FuncTravel</a> is a travel search engine, helping you find the best deals for flights, hotels and car hire. Once you've found your chosen flights, hotel or car hire on Skyscanner, you are taken directly to the website of the travel provider to make your booking and pay directly with them. The travel providers are the best people to help with any questions you have about making a booking, a booking you have already made, or any information about flights and other services. You can usually find their contact details on their website. </p>",
                                screenshots: [
                                    {title: "Flight Search", description: "This page is use for searching flight with oneway, roundtrip", imageUrl: "../photos/functravel-flight-search.png"},
                                    {title: "Flight Result", description: "This page shows the result of many flight agent with the filter tools helping user to choose the best price.", imageUrl: "../photos/functravel-flight-result.png"},
                                    {title: "Hotel Search",  description: "This page is use for searching hotel in your destination", imageUrl: "../photos/functravel-hotel-search.png"},
                                    {title: "Hotel Result",  description: "This page shows the result of many hotel with filter tools helping user to choose the hotel they want", imageUrl: "../photos/functravel-hotel-result.png"},
                                    {title: "Car Rental",  description: "This page is use for renting car in your destination", imageUrl: "../photos/functravel-car-rental.png"},
                                    {title: "Promotion",  description: "This page help user to get the flight events of flight agent", imageUrl: "../photos/functravel-promotion.png"}
                                ]
                            },
                            {
                                startDate: new Date(2011, 4, 10),
                                endDate: new Date(2012, 1, 8),
                                title: "Destinet CMS Project",
                                slideshowOptions: {
                                    captionColor: "#ffffff"
                                },
                                description: "<p><b>Position:</b>Developer</p>" +
                                    "<p><b>Technology:</b>ASP.NET, Javascript, Css 3, XML</p>" +
                                    "<p><b>Description: </b>Destinet CMS is a Web Portal, the most flexible and dynamic Publishing Tool that has made it even easier to update their own websites.Using the graphical user interface, an administrator can publish text, pictures and multimedia. In addition, the content is structured and categorized in a menu system. Different publishing tools have different capabilities, and flexibility.</p>",
                                screenshots: [
                                    {title: "Destinet Admin", description: "This page helps user to create a web page with drag and drop", imageUrl: "../photos/destinet-admin-page.png"},
                                    {title: "Destinet SEO", description: "This module helps user to seo their website", imageUrl: "../photos/destinet-ceo.png"},
                                    {title: "Destinet Market", description: "This module helps user to buy the module on the Destinet Store to improve their website", imageUrl: "../photos/destinet-market.png"},
                                    {title: "Destinet Undo Redo", description: "This module stores all the user steps that making easy to restore the last action", imageUrl: "../photos/destinet-undo-redo.png"},
                                    {title: "Destinet Client", description: "After drag and drop, config we have the beautiful page in a few minutes", imageUrl: "../photos/destinet-client-page.png"},
                                ]
                            }
                        ]
                    },
                    {
                        id: 2,
                        startDate: new Date(2009, 9, 15),
                        endDate: new Date(2010, 7, 1),
                        contents: [
                            {
                                startDate: new Date(2011, 9, 15),
                                endDate: new Date(2010, 7, 1),
                                title: "Soctrang Sosuco Project",
                                description: "<p><b>Position:</b> Web Developer</p>" +
                                    "<p><b>Technology:</b> C#.net,ASP.net MVC,JQuery,SQL Server 2008</p>" +
                                    "<p><b>Description: </b> This is the News Website for Sosuco Company with Admin small ERP behind to manage products, warehouse </p>" +
                                    "<p><img alt='Sosuco' src='../photos/sosuco.png' /></p>",
                                slideshowOptions: {
                                    captionColor: "#ffffff"
                                },
                                screenshots: []
                            }
                        ]
                    },
                    {
                        id: 3,
                        startDate: new Date(2010, 7, 20),
                        endDate: new Date(2011, 4, 3),
                        contents: [
                            {
                                startDate: new Date(2010, 7, 20),
                                endDate: new Date(2011, 4, 3),
                                title: "CCID, AccomoDate, RecConnect Project",
                                description: "<p><b>Position:</b> Web Developer</p>" +
                                    "<p><b>Technology:</b> C#.net,ASP.net MVC,JQuery,SQL Server 2008,BIRT Reporting,Java,Tomcat</p>" +
                                    "<p><b>Description: </b> <a href='http://www.letterbllc.com/projects-ccid.html'>Letter B</a>  worked with CCI Programs from Inception, to Design through Development, Testing and Implementation of their program management system.  The system was custom developed around the many processes that CCI Programs uses to collect and report data about their participants. </p>",
                                slideshowOptions: {
                                    captionColor: "#0000ff"
                                },
                                screenshots: [
                                    {title: "CCID", description: "Hot Feet Youth Programs are designed to provide ready, in hand practice content for volunteer youth coaches. These materials are developed by experts in training and youth coaching to help coaches that don’t have a lot of time to prepare for practice or a lot of background expertise in the sport they arevolunteering to help out with. ", imageUrl: "../photos/letterbip-ccid.png"},
                                    {title: "AccommoDate", description: "AccommoDate provides organizations who have a first-come, first-served process for guests software to manage the guest registration and management process. The system accurately tracks when a request is made along with other useful information about the request.", imageUrl: "../photos/letterbip-accomudate.png"},
                                    {title: "RecConnect", description: "RecConnect helps families and individuals stay connected to their community by always providing them with current information that is tailored to fit their interests about what is going on in their community. By telling us what they are interested in, RecConnect helps them find activities and events that fit their interests.", imageUrl: "../photos/letterbip-recconnect.png"},
                                ]
                            },
                        ]
                    },
                    {
                        id: 4,
                        startDate: new Date(2009, 2, 15),
                        endDate: new Date(2009, 8, 11),
                        contents: [
                            {
                                startDate: new Date(2011, 4, 10),
                                endDate: new Date(2012, 1, 8),
                                title: "Web Developer",
                                slideshowOptions: {
                                    captionColor: "#ffffff"
                                },
                                description: "<p><b>Position:</b> Web Developer</p>" +
                                    "<p><b>Technology:</b> C#.net,ASP.net MVC,JQuery,SQL Server 2002</p>" +
                                    "<p><b>Description: </b> This is website integrated with google maps to store and display the places, description, images. </p>" +
                                    "<p><img alt='Skydoor' src='../photos/skydoor.png' /></p>",
                                screenshots: []
                            },
                        ]
                    }
                ]
            }
        }
    ];
});