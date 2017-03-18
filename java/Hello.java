package java;
import java.io.*;
// import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
public class hello{
    /**
     * sha256
     * */
    public static String sha256Hex(String data){
        return DigestUtils.sha256Hex(data);
    }
    public static void main(String args[]) {
        int b;
        try {
            System.out.println("please Input:");
            while ((b = System.in.read()) != -1) {
                // System.out.print((char) b);
                System.out.println((sha256Hex) b);
            }
        } catch (IOException e) {
            System.out.println(e.toString());
        }
    }
}