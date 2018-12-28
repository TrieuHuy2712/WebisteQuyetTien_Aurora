using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebsiteQuyetTien_byAurora_Team.Models;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using System.Web.Mvc;
using System.Collections;
using System.Linq;
using Newtonsoft.Json;

namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ManageCustomerControllerTest
    {
        [TestMethod]
        public void TestGetCustomer()
        {
            var controller = new ManageCustomerController();
            var result = controller.getCustomer() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Customers.Count(), count);
        }
        [TestMethod]
        public void TestGetTypeID()
        {
            var db = new DmQT08Entities();
            var controller = new ManageCustomerController();
            var model = db.Customers.First();
            var result = controller.getCustomerID(model.ID) as JsonResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(JsonConvert.SerializeObject(new
            {
                model.ID,
                model.CustomerCode,
                model.CustomerName,
                model.YearOfBirth,
                model.PhoneNumber,
                model.Address,
               
                
            }), JsonConvert.SerializeObject(result.Data));
        }
    }
}
