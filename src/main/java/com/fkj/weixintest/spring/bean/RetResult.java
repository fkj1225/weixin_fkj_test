/**
 *Create By @Author:Sean Lei
 *@Date:2014年10月11日
 *@Email:sean.yu.lei@gmail.com
 */
package com.fkj.weixintest.spring.bean;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;

public class RetResult {
	private int result;

	private Object msg;

	public RetResult() {
	}

	public RetResult(int result, Object msg) {
		super();
		this.result = result;
		this.msg = msg;
	}

	public int getResult() {
		return result;
	}

	public void setResult(int result) {
		this.result = result;
	}

	public Object getMsg() {
		return msg;
	}

	public void setMsg(Object msg) {
		this.msg = msg;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this);
	}

}
