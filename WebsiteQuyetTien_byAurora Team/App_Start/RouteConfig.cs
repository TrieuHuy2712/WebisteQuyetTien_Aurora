using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebsiteQuyetTien_byAurora_Team
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //Cấu hình đường dẫn trang xem danh sách sản phẩm\
            routes.MapRoute(
                name: "ViewListProductWithType",
                url: "{ProductTypeName}-{ProductTypeID}",
                defaults: new { controller = "Product", action = "ViewListProductWithType", id = UrlParameter.Optional }
            );
            //Cấu hình đường dẫn trang xem danh sách sản phẩm theo nhà cung cấp\
            routes.MapRoute(
                name: "ViewListProductWithManufactor",
                url: "{ProductTypeName}-{ProductTypeID}/{ManufactoryName}-{ManufactoryID}",
                defaults: new { controller = "Product", action = "ViewListProductWithManufactor", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
