using System;
using System.Collections;
using System.Linq;
using System.Transactions;
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
        [TestMethod]
        public void TestSaveEntity1()
        {
            var db = new DmQT08Entities();
            var model = new Manufactory();

            model.ManufactoryCode = "ABC";
            model.ManufactoryName = "ABC Cake";

            int count = db.Manufactories.Count();
            var controller = new ManageManufactureController();
            using (var scope = new TransactionScope())
            {
                model.ID = 0;
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count + 1, db.Manufactories.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(Manufactory));
                var manufactory = result0.Data as Manufactory;
                Assert.AreEqual("ABC Cake", manufactory.ManufactoryName);
            }
        }
        [TestMethod] 
        public void TestSaveEntity2()
        {
            //Database Quyet Tien
            var db = new DmQT08Entities();
            var model = db.Manufactories.AsNoTracking().First();

            int count = db.Manufactories.Count();
            var controller = new ManageManufactureController();
            using (var scope = new TransactionScope())
            {
                model.ID = 1;
                model.ManufactoryName = "ABC Fruits";
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count, db.Manufactories.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(Manufactory));
                var manufactory = result0.Data as Manufactory;
                Assert.AreEqual("ABC Fruits", manufactory.ManufactoryName);
            }
        }
    }
}
