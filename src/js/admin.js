import "../scss/admin/main.scss";
import 'bootstrap';
import 'bootstrap-switch';

import 'chart.js/dist/Chart.bundle.min';
import 'datatables.net/js/jquery.dataTables.min';
import 'datatables.net-bs4/js/dataTables.bootstrap4.min'

const toastr = require('toastr');
let jQuery = require("jquery-easing");

let windowLoc;
// Admin scripts
(function ($) {
  windowLoc = $(location).attr('pathname');
  let editState = false;
  $('.categoryEdit').click(function (e) {
    if (editState) {
      let id = $(this).closest("tr").children(":first").html();
      let category = $(this).closest("tr").children(".categoryEditName").children(":first").val();
      $.ajax({
        type: 'PUT',
        url: '/admin/categories/edit/' + id,
        data: {
          name: category
        },
      }).done((data, status) => {
        if (status === 'success') {
          editState = false;
          $(this).closest("tr").children(".categoryEditName").html(category);
          let icon = $(this).children(':first');
          icon.removeClass('fa-check-square');
          icon.addClass('fa-edit');
        }
      });
    } else {
      editState = true;
      let category = $(this).closest("tr").children(".categoryEditName").text();
      let icon = $(this).children(':first');
      icon.removeClass('fa-edit');
      icon.addClass('fa-check-square');
      $(this).closest("tr").children(".categoryEditName").html("<input class='form-control' type='text' value='" + category + "'>");
    }
  });

  $('.categoryDelete').click(function (e) {
    let id = $(this).closest("tr").children(":first").html();
    $.ajax({
      type: 'DELETE',
      url: '/admin/categories/delete/' + id
    }).done((data, status) => {
      if (status === 'success') {
        $(this).closest("tr").remove();
      }
    });
  });

  // Call the dataTables jQuery plugin
  $(document).ready(function () {
    $('#dataTable').DataTable();
  });

  "use strict"; // Start of use strict
  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
  })
  // Toggle the side navigation
  $("#sidenavToggler").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });
  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function (e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function (e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });
  // Scroll to top button appear
  $(document).scroll(function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip()
  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });
  let approvalSwitch = $("[name='approve']");
  approvalSwitch.bootstrapSwitch('state', approvalSwitch.data('state'));
  approvalSwitch.on('switchChange.bootstrapSwitch', (e, data) => {
    $.ajax({
      type: 'PATCH',
      url: '/admin/comments/' + approvalSwitch.data('comment-id'),
      data: {
        approveComment: data
      },
      cache: false,
      success: function (data) {
        toastr.success('Comment updated!');
      }
    });
  });
  $('#logout-btn').click(function () {
    $.post('/logout').done((response) => {
      window.location = response.redirect;
    });
  });
})(jQuery); // End of use strict

// Chart.js scripts
if (windowLoc == '/admin') {
  // console.log(JSON.parse(userRegistrations));
// -- Set new default font family and font color to mimic Bootstrap's default styling
  Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#292b2c';
// -- Area Chart Example
  var ctx = document.getElementById("usersChart");

  let data = jQuery.parseJSON(userRegistrations);
  let count = data.length;
  let counter = 0;
  let LabelResult = [];
  let DataResult = [];
  // LabelResult[0] = '02/01/2019';
  // DataResult[0] = 0;
  while (count > 0) {
    LabelResult[counter] = data[counter]._id;
    DataResult[counter] = data[counter].count;
    counter++;
    count--;
  }

  var usersChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: LabelResult,
      datasets: [{
        label: "Users",
        lineTension: 0.3,
        backgroundColor: "rgba(2,117,216,0.2)",
        borderColor: "rgba(2,117,216,1)",
        pointRadius: 5,
        pointBackgroundColor: "rgba(2,117,216,1)",
        pointBorderColor: "rgba(255,255,255,0.8)",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(2,117,216,1)",
        pointHitRadius: 20,
        pointBorderWidth: 2,
        data: DataResult,
      }],
    },
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'll',
            displayFormats: {
              'day': 'MMM DD',
            }
          },
          gridLines: {
            display: false
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
            maxTicksLimit: 10,
            fixedStepSize: 1
          },
          gridLines: {
            color: "rgba(0, 0, 0, .125)",
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });

  var ctx = document.getElementById("countsChart");
  var countsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Posts", "Categories", "Users", "Comments"],
      datasets: [{
        label: "Count",
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: [postCount, categoryCount, userCount, commentCount],
      }],
    },
    options: {
      scales: {
        xAxes: [{
          type: 'category',
          labels: ["Posts", "Categories", "Users", "Comments"],
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 6
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            min: 0,
            maxTicksLimit: 5
          },
          gridLines: {
            display: true
          }
        }],
      },
      legend: {
        display: false
      }
    }
  });
  let userComments = jQuery.parseJSON(comments);
}




