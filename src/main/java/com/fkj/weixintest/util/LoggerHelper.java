package com.fkj.weixintest.util;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggerHelper {
	public static final String LOG_SPERATER = "\n---------------------------------\n";
	private static final String LOG_SPLIT = "|";

	public static String buildDebugMessage(Object o) {
		StringBuilder sb = new StringBuilder(LOG_SPERATER);
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			sb.append(objectMapper.writeValueAsString(o));
		} catch (JsonGenerationException e) {
			warn(LoggerHelper.class, "", e);
		} catch (JsonMappingException e) {
			warn(LoggerHelper.class, "", e);
		} catch (IOException e) {
			warn(LoggerHelper.class, "", e);
		}
		sb.append(LOG_SPERATER);

		return sb.toString();
	}

	public static void debug(Class<?> currentClass, String message,
			Object... args) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.debug(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void debug(Class<?> currentClass, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.debug(message, t);
	}

	public static void debug(String logName, String message, Object... args) {
		Logger log = LoggerFactory.getLogger(logName);
		log.debug(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void debug(String logName, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(logName);
		log.debug(message, t);
	}

	public static void info(Class<?> currentClass, String message,
			Object... args) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.info(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void info(Class<?> currentClass, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.info(message, t);
	}

	public static void info(String logName, String message, Object... args) {
		Logger log = LoggerFactory.getLogger(logName);

		log.info(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void info(String logName, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(logName);
		log.info(message, t);
	}

	public static void warn(Class<?> currentClass, String message,
			Object... args) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.warn(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void warn(Class<?> currentClass, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.warn(message, t);
	}

	public static void warn(String logName, String message, Object... args) {
		Logger log = LoggerFactory.getLogger(logName);
		log.warn(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void warn(String logName, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(logName);
		log.warn(message, t);
	}

	public static void err(Class<?> currentClass, String message,
			Object... args) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.error(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void err(Class<?> currentClass, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(currentClass);
		log.error(message, t);
	}

	public static void err(String logName, String message, Object... args) {
		Logger log = LoggerFactory.getLogger(logName);
		log.error(message + LOG_SPLIT + buildMsg((Object[]) args));
	}

	public static void err(String logName, String message, Throwable t) {
		Logger log = LoggerFactory.getLogger(logName);
		log.error(message, t);
	}

	private static String buildMsg(Object[] objes) {
		StringBuffer sb = new StringBuffer();
		for (Object obj : objes) {
			sb.append(obj.toString());
			sb.append(LOG_SPLIT);
		}
		return sb.toString();
	}
}
