<?php
  if(isset($_POST['sub'])){

    $conn = mysqli_connect('localhost','aaruush2017','xyRhtabnWTvbE28w','aaruush2017') or die("Error: ".mysqli_connect_error());
    $name = $_POST['name'];
    $reg = $_POST['regNo'];
    $type = "";
    $degree =$_POST['degree'];
    $branch = $_POST['branch'];
    $year = $_POST['year'];
   $phone = $_POST['Phone'];
  $email = $_POST['email'];
  $size = $_POST['size'];
echo  $query = "INSERT INTO `srmrun`(`name`, `reg_num`, `degree`, `branch`, `year`, `phone`, `email`,`type`,`t_size`)
   VALUES ('$name', '$reg', '$degree', '$branch', '$year','$phone', '$email','$type','$size')";
   $result = mysqli_query($conn,$query);
   if($result){
     header('location: confirmation.php');
   }
  }


?>
