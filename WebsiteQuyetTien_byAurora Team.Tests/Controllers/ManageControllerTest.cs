using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System.Linq;
using System.Web.Mvc;
using WebsiteQuyetTien_byAurora_Team.Controllers;
using WebsiteQuyetTien_byAurora_Team.Models;
using Moq;
using System.Collections;

namespace WebsiteQuyetTien_byAurora_Team.Tests.Controllers
{
    [TestClass]
    public class ManageControllerTest
    {
        [TestMethod]
        public void TestProductList()
        {
            var controller = new ManageController();
            var result = controller.getProduct() as JsonResult;
            var db = new DmQT08Entities();
            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
                count++;
            Assert.AreEqual(db.Products.Where(x=>x.Status==true).Count(), count);
        }

        [TestMethod]
        public void TestCategory()
        {
            var db = new DmQT08Entities();
            var controller = new ManageController();
            var result = controller.getProductType() as JsonResult;
           
                        Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
            {
                count++;
            }
            Assert.AreEqual(db.ProductTypes.Count(), count);
        }
        [TestMethod]
        public void TestManufacturer()
        {

            var db = new DmQT08Entities();
            var controller = new ManageController();
            var result = controller.getManufacture() as JsonResult;

            Assert.IsNotNull(result);
            var list = result.Data as IEnumerable;
            var count = 0;
            foreach (var item in list)
            {
                count++;
            }
            Assert.AreEqual(db.Manufactories.Count(), count);
        }

        [TestMethod]
        public void ChiTietSanPham()
        {
            var db = new DmQT08Entities();
            var controller = new ManageController();
            var model = db.Products.First();
            var result = controller.GetById(model.ID) as JsonResult;
            Assert.IsNotNull(result);
            Assert.AreEqual(JsonConvert.SerializeObject(new
            {
                ID = model.ID,
                ProductCode = model.ProductCode,
                ProductName = model.ProductName,
                SalePrice = model.SalePrice,
                Quantity = model.Quantity,
                OriginPrice = model.OriginPrice,
                Description = model.Description,
                ManufactoryID = model.ManufactoryID,
                InstallmentPrice = model.InstallmentPrice,
                ProductTypeID = model.ProductTypeID,
                
                Status = model.Status,
                Avatar= model.Avatar,
                ProductTypeName = model.ProductType.ProductTypeName,
                ManufactoryName = model.Manufactory.ManufactoryName,
                
               

            }), JsonConvert.SerializeObject(result.Data));
        }
    }
}