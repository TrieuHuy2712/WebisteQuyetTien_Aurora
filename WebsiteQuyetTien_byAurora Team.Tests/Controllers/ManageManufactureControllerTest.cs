using System;
using System.Collections;
using System.Linq;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using WebsiteQuyetTien_byAurora_Team.Models;

namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ManageManufactureControllerTest
    {
        [TestMethod]
        public void TestGetManuProduct()
        {
            var controller = new ManageManufactureController();
            var result = controller.getTypeProduct() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Manufactories.Count(), count);
        }
        [TestMethod]
        public void TestGetTypeID()
        {
            var db = new DmQT08Entities();
            var controller = new ManageManufactureController();
            var model = db.Manufactories.First();
            var result = controller.getTypeID(model.ID) as JsonResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(JsonConvert.SerializeObject(new
            {
                model.ManufactoryName,
                model.ManufactoryCode,
            }), JsonConvert.SerializeObject(result.Data));
        }
    }
}
