// String password3=StringEncrypt.Encrypt(password);

// System.out.println(password3)

//SHA256加密算法

public static class StringEncrypt {
  /**
   * * 对字符串加密,加密算法使用MD5,SHA-1,SHA-256,默认使用SHA-256          *
   * @return
   * @param  bytes2Hex(md.digest() [description]
   * @return                       [description]
   */
  public static String Encrypt(String strSrc) {
    MessageDigest md = null;
    String strDes = null;
    String encName="SHA-256";
    byte[] bt = strSrc.getBytes();
    try {
      md = MessageDigest.getInstance(encName);
      md.update(bt);
      strDes = bytes2Hex(md.digest());
    // to HexString
    } catch (NoSuchAlgorithmException e) {
      return null;
    }
    return strDes;
  }
  public static String bytes2Hex(byte[] bts) {
    String des = "";
    String tmp = null;
    for (int i = 0; i < bts.length; i++) {
      tmp = (Integer.toHexString(bts[i] & 0xFF));
      if (tmp.length() == 1) {
        des += "0";
      }
      des += tmp;
    }
    return des;
  }
  public static void main(String args[]) {
      int b;
      try {
          System.out.println("please Input:");
          while ((b = System.in.read()) != -1) {
              System.out.print((char) b);
          }
      } catch (IOException e) {
          System.out.println(e.toString());
      }
  }
}