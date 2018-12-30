using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebsiteQuyetTien_byAurora_Team.Models;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using System.Web.Mvc;
using System.Collections;
using System.Linq;
using Newtonsoft.Json;
using System.Transactions;

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
        [TestMethod]
        public void TestSaveEntity1()
        {
            var db = new DmQT08Entities();
            var model = new Customer();

            model.CustomerCode = "12312312";
            model.CustomerName = "Vien Thuy";
            model.PhoneNumber = "123123123";
            model.Address = "BinhThanh";
            model.YearOfBirth = 1998;
           

            int count = db.Customers.Count();
            var controller = new ManageCustomerController();
            using (var scope = new TransactionScope())
            {
                model.ID = 0;
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count + 1, db.Customers.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(Customer));
                var customer = result0.Data as Customer;
                Assert.AreEqual(1998, customer.YearOfBirth);
            }
        }
        [TestMethod]
        public void TestSaveEntity2()
        {
            var db = new DmQT08Entities();
            var model = db.Customers.AsNoTracking().First();

            int count = db.Customers.Count();
            var controller = new ManageCustomerController();
            using (var scope = new TransactionScope())
            {
                model.ID = 1;
                model.CustomerName= "Manh Hung";
                var result0 = controller.SaveEntity(model) as JsonResult;
                Assert.IsNotNull(result0);
                Assert.AreEqual(count, db.Customers.Count());

                Assert.IsInstanceOfType(result0.Data, typeof(Customer));
                var customer = result0.Data as Customer;
                Assert.AreEqual("Manh Hung", customer.CustomerName);
            }
        }
    }
}
