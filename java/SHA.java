import org.apache.commons.codec.digest.DigestUtils;
/*public class Test {
    public static void main(String[] args){
        DigestUtils a = new DigestUtils();
        String strInput="dsfdgsdfdg";
        byte[] byBuffer= strInput.getBytes();
        System.out.println(a.encodeSHA256(byBuffer));
    }
}*/

import org.apache.commons.codec.digest.DigestUtils;

class SHA {

    /**
     * @param args
     */
    public static void main(String[] args){
        String str = "channel_id=000032&channel_order_no=99000000000155573&goods_desc=%E5%B9%B3%E5%AE%89e%E7%94%9F%E4%BF%9D&notify_url=https%3A%2F%2Fwww.baidu.com&return_url=https%3A%2F%2Fwww.baidu.com&total_fee=24900KOGVURQHB2V369GS2Q6FZD3ZPY15ZK3I";
        // SHA-256
        String resultHex = DigestUtils.sha256Hex(str);
        System.out.println(resultHex);

        // byte[] byBuffer= str.getBytes("GBK");
        // c37d782b4b539fc7115349881b308b6ef2a973481edc6505c9b97e8e6bce06f7
        // String result = DigestUtils.sha256(str);
        // System.out.println(result);


// http://test-mobile.health.pingan.com/ehis-hm/cashier/pay.do?channel_id=000032&channel_order_no=99000000000155464&goods_desc=%E5%B9%B3%E5%AE%89e%E7%94%9F%E4%BF%9D&notify_url=https%3A%2F%2Fwww.baidu.com&return_url=https%3A%2F%2Fwww.baidu.com&sign=c37d782b4b539fc7115349881b308b6ef2a973481edc6505c9b97e8e6bce06f7&sign_type=SHA-256&total_fee=24900

// http://test-mobile.health.pingan.com/ehis-hm/cashier/pay.do?channel_id=000032&channel_order_no=99000000000155573&goods_desc=%E5%B9%B3%E5%AE%89e%E7%94%9F%E4%BF%9D&notify_url=https://www.baidu.com&return_url=https://www.baidu.com&sign=bbd7979c1421000e7e9a9d4ef009602bc29e3ee8f565648139dbd6e4f96a5ba4&sign_type=SHA-256&total_fee=24900

        // String result2 = DigestUtils.sha256Hex("channel_id=000008&channel_order_no=TEST000000000105784&goods_desc=中文&notify_url=111111&return_url=111111&total_fee=130500KOGVURQHB2V369GS2Q6FZD3ZPY15ZK3I");
        // System.out.println(result2);
/*        // SHA-384
        String result2 = DigestUtils.sha384Hex("www.what21.com");
        System.out.println(result2);
        // SHA-512
        String result3 = DigestUtils.sha512Hex("www.what21.com");
        System.out.println(result3);
        // SHA-1
        String result4 = DigestUtils.sha1Hex("www.what21.com");
        System.out.println(result4);*/
    }

}