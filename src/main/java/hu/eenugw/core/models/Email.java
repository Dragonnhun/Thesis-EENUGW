package hu.eenugw.core.models;

public class Email {
    private String _toAddress;
    private String _fromAddress;
    private String _senderName;
    private String _subject;
    private String _content;

    public Email(String toAddress, String fromAddress, String senderName, String subject, String content) {
        _toAddress = toAddress;
        _fromAddress = fromAddress;
        _senderName = senderName;
        _subject = subject;
        _content = content;
    }

    public String getToAddress() {
        return _toAddress;
    }

    public void setToAddress(String toAddress) {
        _toAddress = toAddress;
    }

    public String getFromAddress() {
        return _fromAddress;
    }

    public void setFromAddress(String fromAddress) {
        _fromAddress = fromAddress;
    }

    public String getSenderName() {
        return _senderName;
    }

    public void setSenderName(String senderName) {
        _senderName = senderName;
    }

    public String getSubject() {
        return _subject;
    }

    public void setSubject(String subject) {
        _subject = subject;
    }

    public String getContent() {
        return _content;
    }
    
    public void setContent(String content) {
        _content = content;
    }
}
