import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class DigestUtils{

    static MessageDigest getDigest(String algorithm) {
        try {
            return MessageDigest.getInstance(algorithm);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    private static MessageDigest getMd5Digest() {
        return getDigest("MD5");
    }

    private static MessageDigest getShaDigest() {
        return getDigest("SHA");
    }

    private static MessageDigest getSha256Digest() {
        return getDigest("SHA-256");
    }

    private static MessageDigest getSha384Digest() {
        return getDigest("SHA-384");
    }

    private static MessageDigest getSha512Digest() {
        return getDigest("SHA-512");
    }

    public static byte[] encodeMD5(byte[] data) {
        return getMd5Digest().digest(data);
    }

    public static byte[] encodeSHA(byte[] data) {
        return getShaDigest().digest(data);
    }


    public static byte[] encodeSHA256(byte[] data) {
        return getSha256Digest().digest(data);
    }

    public static byte[] encodeSHA384(byte[] data) {
        return getSha384Digest().digest(data);
    }


    public static byte[] encodeSHA512(byte[] data) {
        return getSha512Digest().digest(data);
    }

    public static void main(String[] args){
        DigestUtils a = new DigestUtils();
        String strInput="dsfdgsdfdg";
        byte[] byBuffer= strInput.getBytes();
        System.out.println(a.encodeSHA256(byBuffer));
    }
}