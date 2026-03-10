import java.sql.*;
public class JdbcProbe {
  public static void main(String[] args) {
    String[] passwords = {"root", "", "Msk@13819960633"};
    for (String pwd : passwords) {
      try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        try (Connection c = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/iron_management?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai", "root", pwd);
             Statement s = c.createStatement();
             ResultSet rs = s.executeQuery("SELECT USER(), CURRENT_USER(), COUNT(*) FROM customer")) {
          while (rs.next()) {
            System.out.println("OK user=root pwd=" + pwd + " USER()=" + rs.getString(1) + " CURRENT_USER()=" + rs.getString(2) + " customer_count=" + rs.getInt(3));
          }
        }
      } catch (Throwable e) {
        System.out.println("FAIL user=root pwd=" + pwd + " => " + e.getClass().getName() + ": " + e.getMessage());
      }
    }
  }
}
